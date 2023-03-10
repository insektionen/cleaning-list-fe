import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import DetailsRow from '../components/DetailsRow';
import Input from '../components/Input';
import Page from '../components/Page';
import Select from '../components/Select';
import Spin from '../components/Spin';
import { Role, User } from '../user/types';
import userApi from '../user/user.api';
import { useUser } from '../user/user.context';
import { roleAtLeast } from '../util/minRole';
import { emailRegex } from '../util/regex';
import { capitalize } from '../util/text';

export default function UserDetails() {
	const { user: main, invalidateToken, updateUser } = useUser();
	const { handle } = useParams();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<User>();

	const [isEditing, setIsEditing] = useState(false);
	const [loadingSave, setLoadingSave] = useState(false);
	const [name, setName] = useState<string>();
	const [email, setEmail] = useState<string>();
	const [role, setRole] = useState<Role>();
	const [currentPassword, setCurrentPassword] = useState('');
	const [password, setPassword] = useState('');

	const ownUser = !handle || handle === main.handle;
	const canEdit = ownUser || (user && !roleAtLeast(user.role, main.role));

	const possibleRoles = useMemo<Role[]>(() => {
		if (ownUser || !user) return ['BASE'];
		if (main.role === 'ADMIN') return ['BASE', 'MANAGER', 'MOD', 'ADMIN'];

		return ['BASE', 'MANAGER'];
	}, [ownUser, main, user]);

	useEffect(() => {
		if (!handle || main.handle === handle.toLowerCase()) {
			setUser(main);
			setLoading(false);
			return;
		}

		userApi
			.findUser(handle)
			.then(setUser)
			.catch()
			.finally(() => setLoading(false));
	}, [handle]);

	function cancelEdit(message: string | any) {
		setName(undefined);
		setEmail(undefined);
		setIsEditing(false);
		if (message && typeof message === 'string') toast.success(message);
	}

	async function saveChanges() {
		if (!user) return;
		if (name === '' || email === '') return toast.error('No field can be empty');
		if (email && !emailRegex.test(email)) return toast.error('Invalid email address');
		if (!name && !email && !role) return cancelEdit('Saved without changes');
		// Ask to confirm irreversible actions
		if (role && roleAtLeast(role, main.role) && !confirm(confirmAdminChange(user.name))) return;

		setLoadingSave(true);
		try {
			if (!ownUser) {
				const updatedUser = await userApi.updateUser(user.handle, { name, email, role });
				setUser(updatedUser);
				toast.success(`Successfully updated user ${updatedUser.name}`);
				setIsEditing(false);
			} else {
				const updatedUser = await userApi.updateUser(user.handle, { name, email }, true);
				setUser(updatedUser);
				updateUser(updatedUser);
				toast.success(`Successfully updated your user`);
				setIsEditing(false);
			}
		} catch (e) {}
		setLoadingSave(false);
	}

	async function changePassword() {
		if (!user) return;

		if (!currentPassword)
			return toast.error(
				ownUser ? 'The current password is required.' : 'Your password is required.'
			);
		if (!password) return toast.error('A new password is required');

		setLoadingSave(true);
		try {
			if (!ownUser) {
				const updatedUser = await userApi.updateUser(user.handle, { currentPassword, password });
				setUser(updatedUser);
				toast.success(`Successfully updated ${updatedUser.name}'s password`);
				setPassword('');
				setCurrentPassword('');
			} else {
				const updatedUser = await userApi.updateUser(
					user.handle,
					{ currentPassword, password },
					true
				);
				setUser(updatedUser);
				updateUser(updatedUser);
				toast.success(`Successfully updated your password`);
				setPassword('');
				setCurrentPassword('');
			}
		} catch (e) {}
		setLoadingSave(false);
	}

	return (
		<Page className="user-details">
			{loading ? (
				<Spin size="medium" className="self-center" style={{ margin: '2rem 0' }} />
			) : user ? (
				<>
					<div>
						{!isEditing ? (
							<h1>{user.name}</h1>
						) : (
							<Input
								value={name ?? user.name}
								onChange={(val) => setName(val !== user.name ? val : undefined)}
								style={{ fontSize: '1.4rem' }}
								width="wide"
							/>
						)}
						<h2
							style={{ fontSize: '1.2rem', margin: '0 0 0.25rem', color: '#bbb', fontWeight: 500 }}
						>
							@{user.handle}
						</h2>
					</div>
					<dl>
						<DetailsRow
							title="Email"
							displayValue={breakableEmail(user.email)}
							editing={isEditing}
							editContent={
								<Input
									value={email ?? user.email ?? ''}
									onChange={(val) => setEmail(val !== user.email ? val : undefined)}
									width="full"
									style={{ margin: 0 }}
								/>
							}
						/>
						<DetailsRow
							title="Role"
							displayValue={capitalize(user.role.toLowerCase())}
							editing={!ownUser && isEditing}
							editContent={
								<Select
									width="full"
									value={role ?? user.role}
									onChange={(val) => setRole(val !== user.role ? val : undefined)}
									options={possibleRoles.map((role) => ({
										key: role,
										display: capitalize(role.toLowerCase()),
									}))}
								/>
							}
						/>
					</dl>
					{canEdit &&
						(isEditing ? (
							<div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: '1fr 1fr' }}>
								<button onClick={cancelEdit} disabled={loadingSave}>
									Cancel
								</button>
								<button onClick={saveChanges} disabled={loadingSave}>
									{loadingSave ? <Spin /> : 'Save'}
								</button>
							</div>
						) : (
							<button onClick={() => setIsEditing(true)}>Edit User</button>
						))}

					{(ownUser || (main.role === 'ADMIN' && user.role !== 'ADMIN')) && (
						<>
							<div className="divider" />
							<h3 style={{ marginBottom: '0.5rem' }}>Change password</h3>
							<Input
								value={currentPassword}
								onChange={setCurrentPassword}
								title={ownUser ? 'Current password' : 'Your password'}
								type="password"
							/>
							<Input value={password} onChange={setPassword} title="New password" type="password" />
							<button onClick={changePassword} style={{ marginTop: '0.5rem' }}>
								{loadingSave ? <Spin /> : 'Change password'}
							</button>
						</>
					)}
				</>
			) : (
				'Something went wrong'
			)}
		</Page>
	);
}

/**
 * Creates an array of react nodes out of the element, adding word breaks around special characters
 */
function breakableEmail(email?: string) {
	if (!email) return email;

	const res: (JSX.Element | string)[] = [email.charAt(0)];
	for (let i = 1; i < email.length; i++) {
		const char = email.charAt(i);

		if (['@', '.', '_'].includes(char))
			res.push(<wbr key={res.length} />, char, <wbr key={res.length + 2} />);
		else if (typeof res[res.length - 1] === 'string') res[res.length - 1] += char;
		else res.push(char);
	}

	return res;
}

function confirmAdminChange(userName: string) {
	return `Are you sure you want to make ${userName} into an admin and give them the powers therein?\n\nThis action cannot be undone.`;
}
