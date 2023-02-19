import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { updateList } from '../list/list.api';
import { List } from '../list/list.model';
import { MinimalUser, User } from '../user/types';
import { findUsers } from '../user/user.api';
import { roleAtLeast } from '../util/minRole';
import useDebounce from '../util/useDebounce';
import Autocomplete from './Autocomplete';
import Input from './Input';
import Modal from './Modal';
import Spin from './Spin';

type ListOptionsModalProps = {
	open: boolean;
	setOpen: (setOpen: boolean) => void;
	list: List;
	setList: (setList: List) => void;
	user: User;
};

export default function ListOptionsModal({
	open,
	setOpen,
	list,
	setList,
	user,
}: ListOptionsModalProps) {
	const closeRef = useRef<HTMLButtonElement>(null);
	const [loadingSave, setLoadingSave] = useState(false);

	const [newOwner, setNewOwner] = useState<MinimalUser>(list.ownedBy);
	const { setDebounce, clearDebounce, loading: debounceLoading } = useDebounce(800);
	const [userOptions, setUserOptions] = useState<MinimalUser[]>([list.ownedBy]);
	const promise = useRef<Promise<MinimalUser[]>>();

	async function onSave() {
		const owner = newOwner.handle === list.ownedBy.handle ? undefined : newOwner;
		if (!owner) return;
		if (
			owner &&
			!confirm(`Are you want to transfer this list's ownership to ${owner.name} (@${owner.handle})`)
		)
			return;
		setLoadingSave(true);
		const newList = await updateList(list.id, {
			owner: owner ? owner.handle : undefined,
		});
		toast.success(`Changed list owner to ${newList.ownedBy.name}`);
		setNewOwner(newList.ownedBy);
		setList(newList);
		setLoadingSave(false);
		setOpen(false);
	}

	function onClose() {
		setNewOwner(list.ownedBy);
		setOpen(false);
	}

	function onQueryChange(search: string) {
		setDebounce(async () => {
			if (promise.current) await promise.current;

			promise.current = findUsers({ limit: 5, search });

			const users = await promise.current;

			setUserOptions(users);
		});
	}

	return (
		<Modal
			open={open}
			initialFocus={closeRef}
			onClose={() => setOpen(false)}
			actions={[
				<button key="save" onClick={onSave} disabled={!newOwner}>
					{loadingSave ? <Spin /> : 'Save'}
				</button>,
				<button key="Close" onClick={onClose}>
					Close
				</button>,
			]}
			title="Advanced options"
		>
			<Autocomplete
				value={newOwner}
				setValue={setNewOwner}
				label="Change owner"
				displayValue={(newOwner) => newOwner.name}
				onChange={onQueryChange}
				options={userOptions}
				optionMap={(user) => ({
					key: user.handle,
					display: (
						<div className="flex-row gap-.5" style={{ maxWidth: '100%' }}>
							<span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
								{user.name}
							</span>
							<span style={{ color: '#aaa' }}>@{user.handle}</span>
						</div>
					),
				})}
				compareBy={(a, b) => a.handle === b.handle}
				onBlur={clearDebounce}
				loading={debounceLoading}
			/>
		</Modal>
	);
}
