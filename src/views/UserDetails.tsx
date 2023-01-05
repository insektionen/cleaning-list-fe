import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import DetailsRow from '../components/DetailsRow';
import Input from '../components/Input';
import Page from '../components/Page';
import Spin from '../components/Spin';
import { User } from '../user/types';
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
	const [currentPassword, setCurrentPassword] = useState('');
	const [password, setPassword] = useState('');

	const ownUser = !handle || handle === main.handle;
	const canEdit = ownUser || (user && roleAtLeast(main.role, user.role));

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
		if (!name && !email) return cancelEdit('Saved without changes');

		setLoadingSave(true);
		try {
			if (!ownUser) {
				const updatedUser = await userApi.updateUser(user.handle, { name, email });
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
							currentValue={user.email}
							editable={isEditing && 'input'}
							value={email}
							onChange={setEmail}
						/>
						<DetailsRow title="Role" currentValue={capitalize(user.role.toLowerCase())} />
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

					<button style={{ marginTop: '0.5rem' }} onClick={invalidateToken}>
						Sign Out
					</button>

					<div
						style={{
							height: '0.1rem',
							width: '100%',
							backgroundColor: 'currentcolor',
							margin: '1rem 0',
						}}
					/>

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
			) : (
				'Something went wrong'
			)}
		</Page>
	);
}
