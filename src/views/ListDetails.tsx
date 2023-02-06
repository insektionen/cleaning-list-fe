import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router';
import Checkbox from '../components/Checkbox';
import DetailsRow from '../components/DetailsRow';
import Input from '../components/Input';
import Page from '../components/Page';
import Spin from '../components/Spin';
import NotSubmitted from '../icons/NotSubmitted';
import Reload from '../icons/Reload';
import Submitted from '../icons/Submitted';
import Verified from '../icons/Verified';
import listApi from '../list/list.api';
import { List } from '../list/list.model';
import { useUser } from '../user/user.context';
import { roleAtLeast } from '../util/minRole';
import { phoneNumberRegex } from '../util/regex';
import { useTranslate } from '../util/translation';
import useInputRef from '../util/useInputRef';
import validateDate from '../util/validateDate';

const DEBOUNCE_TIME = 5_000;
const TOAST_ID = 'list-edit';

export default function ListDetails() {
	const { listId } = useParams();
	const { user } = useUser();
	const { t, loading: loadingTranslation } = useTranslate();

	const [loading, setLoading] = useState(true);
	const [list, setList] = useState<List>();
	const [isEditing, setIsEditing] = useState(false);
	const [isReloading, setIsReloading] = useState(false);
	const [editedFields, setEditedFields] = useState<{
		changes: Record<string, boolean | undefined>;
		alteredBy: 'user' | 'saver';
	}>({ changes: {}, alteredBy: 'user' });
	const [updatingList, setUpdatingList] = useState(false);

	const nameRef = useInputRef();
	const phoneRef = useInputRef();
	const dateRef = useInputRef();
	const commentRef = useInputRef();

	const canEdit = useMemo(
		() =>
			(user.handle === list?.createdBy.handle || roleAtLeast(user.role, 'MOD')) && !list?.submitted,
		[user, list]
	);
	const canVerify = useMemo(
		() =>
			list?.submitted &&
			!list.verified &&
			(roleAtLeast(user.role, 'MOD') ||
				(user.role === 'MANAGER' && user.handle !== list.createdBy.handle)),
		[user, list]
	);
	const canReload = useMemo(() => {
		if (!list) return false;
		return !list.submitted;
	}, [list]);

	useEffect(() => {
		const id = Number(listId);
		if (!id) {
			toast.error(`Invalid list id provided: ${listId}`);
			return setLoading(false); // Should perhaps navigate to another page instead?
		}

		listApi
			.findList(id)
			.then((list) => {
				setList(list);
				setLoading(false);
			})
			.catch(() => {
				setLoading(false); // Should perhaps navigate to another page instead?
			});
	}, []);

	useEffect(() => {
		if (!list) return;

		if (canEdit && user.handle === list.createdBy.handle && !list.submitted) setIsEditing(true);
	}, [user, list]);

	const debounce = useRef<NodeJS.Timeout | null>(null);
	const promise = useRef<Promise<List> | null>(null);
	const savingChanges = useRef(false);

	useEffect(() => {
		if (editedFields.alteredBy !== 'user') return;
		if (debounce.current) clearTimeout(debounce.current);
		if (!Object.values(editedFields.changes).some((val) => val !== undefined)) {
			if (debounce.current && !savingChanges.current)
				toast.success('No changes to save', { id: TOAST_ID, duration: 2_000 });

			debounce.current = null;
			return;
		}

		toast.loading('Waiting...', {
			position: 'bottom-right',
			duration: Infinity,
			id: TOAST_ID,
		});
		debounce.current = setTimeout(saveChanges, DEBOUNCE_TIME);
	}, [editedFields.changes]);

	async function saveChanges() {
		if (!list) return;
		debounce.current = null;

		if (promise.current) {
			await promise.current;
		}

		savingChanges.current = true;
		toast.loading('Saving...', { id: TOAST_ID });

		const changes = { ...editedFields.changes };
		promise.current = listApi.updateList(list?.id, {
			fields: changes as Record<string, boolean>,
		});
		setEditedFields({ changes: {}, alteredBy: 'saver' });
		try {
			const newList = await promise.current;
			setList(newList);
			toast.success('Saved', { id: TOAST_ID, duration: 4_000 });
		} catch (error) {
			setEditedFields({ changes: { ...changes, ...editedFields.changes }, alteredBy: 'saver' });
			toast.dismiss(TOAST_ID);
		}

		promise.current = null;
		savingChanges.current = false;
	}

	function changeField(field: string) {
		if (!list) return;

		setEditedFields({
			changes: {
				...editedFields.changes,
				[field]: editedFields.changes[field] === undefined ? !list.fields[field] : undefined,
			},
			alteredBy: 'user',
		});
	}

	async function handleSubmit() {
		if (!list) return;

		const responsible = nameRef.current?.value;
		const phoneNumber = phoneRef.current?.value.replace(/[ \-\(\)]/g, '');
		const date = dateRef.current?.value;
		const comment = commentRef.current?.value || null;

		const missing = [
			{ name: 'Name', val: responsible },
			{ name: 'Phone number', val: phoneNumber },
			{ name: 'Date of event', val: date },
		].find(({ val }) => !val);
		if (!responsible || !phoneNumber || !date) return toast.error(`${missing?.name} is missing`);

		if (!phoneNumber.match(phoneNumberRegex)) return toast.error('Phone number is invalid');
		const eventDate = validateDate(date);
		if (eventDate === null) return toast.error('Date is invalid, must be in YYYY-MM-DD format');

		setUpdatingList(true);

		const fields: Record<string, boolean> = {};
		if (promise.current) {
			await promise.current;
		} else {
			for (const fieldKey in editedFields.changes) {
				const fieldValue = editedFields.changes[fieldKey];
				if (fieldValue !== undefined) fields[fieldKey] = fieldValue;
			}
		}

		const fieldsMissing = !Object.values({ ...list.fields, ...fields }).every((field) => field);

		if (fieldsMissing && !comment) {
			toast.error("A comment is required if all fileds aren't filled out");
			return setUpdatingList(false);
		}

		if (debounce.current) {
			clearTimeout(debounce.current);
		}
		debounce.current = null;
		promise.current = null;

		if (
			fieldsMissing &&
			!confirm('Are you sure you want to submit the list with incomplete fields?')
		) {
			// Restart debounce timer, half time to pretend like it was paused
			debounce.current = setTimeout(saveChanges, DEBOUNCE_TIME / 2);
			return setUpdatingList(false);
		}

		toast.dismiss(TOAST_ID); // Dismiss toast if list is submitted

		try {
			const newList = await listApi.updateList(list.id, {
				responsible,
				phoneNumber,
				eventDate,
				comment,
				submit: true,
			});
			setList(newList);
			setIsEditing(false);
			toast.success('Sucessfully submitted list');
		} catch (e) {}

		setUpdatingList(false);
	}

	async function verifyList() {
		if (!list || !canVerify) return;

		if (!confirm('Are you sure you want to verify this list?')) return;

		setUpdatingList(true);
		try {
			const newList = await listApi.updateList(list.id, { verify: true });
			toast.success('List successfully verified');
			setList(newList);
		} catch (e) {}
		setUpdatingList(false);
	}

	function reload() {
		setIsReloading(true);

		const toastId = toast.loading('Reloading', { duration: Infinity });

		listApi
			.findList(Number(listId))
			.then(setList)
			.then(() => toast.success('Reloaded list', { duration: 2_000, id: toastId }))
			.catch(() => toast.dismiss(toastId))
			.finally(() => setIsReloading(false));
	}

	return (
		<Page className="list-details">
			{loading || loadingTranslation ? (
				<Spin size="medium" />
			) : list ? (
				<>
					<div className="fixed-actions">
						{canEdit && user.handle !== list.createdBy.handle && (
							<button onClick={() => setIsEditing((isEditing) => !isEditing)}>
								{isEditing ? 'Stop Editing' : 'Begin Editing'}
							</button>
						)}
						{!isEditing && canReload && (
							<button onClick={reload} disabled={isReloading} className="icon-button">
								<Reload size="1.2rem" />
							</button>
						)}
					</div>
					<h1>{t(list.type, 'name')}</h1>
					{list.structure.map((area, areaIndex) => (
						<div key={area.name} className="area">
							<h2>{t(list.type, 'areas', area.name, 'name')}</h2>
							{area.categories.map((category, catIndex) => (
								<div key={category.name} className="category">
									{category.name !== 'all' && (
										<h3>{t(list.type, 'areas', area.name, 'categories', category.name, 'name')}</h3>
									)}
									{category.checks.map((check, checkIndex) => {
										const field = `${areaIndex}.${catIndex}.${checkIndex}`;
										return (
											<Checkbox
												key={check}
												label={t(
													list.type,
													'areas',
													area.name,
													'categories',
													category.name,
													'checks',
													check
												)}
												disabled={!isEditing}
												color={list.colors?.[area.name]}
												value={editedFields.changes[field] ?? list.fields[field]}
												onChange={() => changeField(field)}
											/>
										);
									})}
								</div>
							))}
							{area.comment && <span className="comment">{t('comments', area.comment)}</span>}
						</div>
					))}
					<div className="end-content flex-col">
						{isEditing ? (
							<form
								onSubmit={(event) => {
									event.preventDefault();
									handleSubmit();
								}}
							>
								<Input ref={nameRef} title="Responsible" width="wide" />
								<Input ref={phoneRef} title="Phone number" width="wide" />
								<Input ref={dateRef} title="Date of Event" width="wide" />
								<Input ref={commentRef} title="Comment" width="wide" />

								<button type="submit" disabled={updatingList}>
									{updatingList ? <Spin /> : 'Submit'}
								</button>
							</form>
						) : (
							<>
								{list.submitted && (
									<dl>
										<DetailsRow title="Responsible" currentValue={list.responsible ?? ''} />
										<DetailsRow title="Phone number" currentValue={list.phoneNumber ?? ''} />
										<DetailsRow title="Date of Event" currentValue={list.eventDate ?? ''} />
										<DetailsRow title="Comment" currentValue={list.comment ?? '-'} />
									</dl>
								)}
								{list.verified ? (
									<div className="status">
										<Verified size="1.8rem" />
										<span>Verified</span>
									</div>
								) : canVerify ? (
									<button onClick={verifyList} disabled={updatingList}>
										{updatingList ? <Spin /> : 'Verify'}
									</button>
								) : list.submitted ? (
									<div className="status">
										<Submitted size="1.8rem" />
										<span>Unverified</span>
									</div>
								) : (
									<div className="status">
										<NotSubmitted size="1.8rem" />
										<span>In Progress</span>
									</div>
								)}
							</>
						)}
					</div>
				</>
			) : (
				'Something went wrong'
			)}
		</Page>
	);
}
