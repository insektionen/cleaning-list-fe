import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Page from '../components/Page';
import Select from '../components/Select';
import Spin from '../components/Spin';
import { Role } from '../user/types';
import userApi from '../user/user.api';
import { useUser } from '../user/user.context';
import { roleAtLeast } from '../util/minRole';
import { usernameRegex } from '../util/regex';
import { capitalize } from '../util/text';
import useInputRef from '../util/useInputRef';

const defaultOptions: Role[] = ['BASE', 'MANAGER', 'MOD'];

export default function CreateUser() {
	const navigate = useNavigate();
	const { user } = useUser();

	const userRef = useInputRef();
	const nameRef = useInputRef();
	const passRef = useInputRef();
	const [role, setRole] = useState<Role>('BASE');
	const [loading, setLoading] = useState(false);

	const options: Role[] = user.role === 'ADMIN' ? [...defaultOptions, 'ADMIN'] : defaultOptions;

	async function submit() {
		const username = userRef.current?.value;
		const name = nameRef.current?.value;
		const password = passRef.current?.value;
		if (!username || !name || !password) return toast.error('Missing fields');

		if (username.length > 24) return toast.error("Username can't be longer than 24 characters");
		if (!username.match(usernameRegex))
			return toast.error('Username can only contain alphanumeric characters, dash, and underscore');

		if (
			roleAtLeast(role, 'MOD') &&
			!confirm(`Are you sure you want to create a new user with ${role.toLowerCase()} permissions?`)
		)
			return;

		setLoading(true);
		try {
			const user = await userApi.newUser(username, password, name, role);
			toast.success(`Succesfully created new user ${user.name}`);
			navigate('/');
		} catch (e) {
			setLoading(false);
		}
	}

	return (
		<Page header="Create User" headerColor="#ffdd59">
			<form
				onSubmit={(event) => {
					event.preventDefault();
					submit();
				}}
			>
				<Input ref={userRef} title="Username" width="wide" />
				<Input ref={nameRef} title="Name" width="wide" />
				<Input ref={passRef} title="Password" width="wide" type="password" />
				<Select
					value={role}
					onChange={setRole}
					options={options.map((opt) => ({ key: opt, display: capitalize(opt.toLowerCase()) }))}
					title="Role"
					width="wide"
				/>
				<button type="submit">{loading ? <Spin /> : 'Submit'}</button>
			</form>
		</Page>
	);
}
