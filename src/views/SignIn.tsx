import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Page from '../components/Page';
import { useUser } from '../user/user.context';
import useInputRef from '../util/useInputRef';

export default function SignIn() {
	const userRef = useInputRef();
	const passRef = useInputRef();
	const { signIn } = useUser();

	return (
		<Page header="Sign In" headerColor="#f8c291">
			<form
				style={{ marginBottom: '1rem' }}
				onSubmit={(event) => {
					event.preventDefault();

					const username = userRef.current?.value;
					const password = passRef.current?.value;
					if (!username || !password) return;

					signIn(username, password);
				}}
			>
				<Input title="Username" ref={userRef} width="wide" />
				<Input title="Password" type="password" ref={passRef} width="wide" />
				<button type="submit">Sign in</button>
			</form>
			<Link to="/forgot-password">Forgot password?</Link>
			<Link to="/new-user">New user?</Link>
		</Page>
	);
}
