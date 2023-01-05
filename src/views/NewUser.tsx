import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import Input from '../components/Input';
import Page from '../components/Page';
import Spin from '../components/Spin';
import { useUser } from '../user/user.context';
import { usernameRegex } from '../util/regex';
import useInputRef from '../util/useInputRef';

export default function NewUser() {
	const [loading, setLoading] = useState(false);
	const secretRef = useInputRef();
	const userRef = useInputRef();
	const passRef = useInputRef();
	const nameRef = useInputRef();
	const { createUserWithSecret } = useUser();

	return (
		<Page header="New User" headerColor="#33d9b2" className="text-box">
			<p>
				If you don't already have a user you can create one here. To do this you need to have access
				to the <b>secret</b>. It should be posted somewhere you can access.
			</p>
			<p>
				Please make sure that you don't already have a user before creating one. If the handle you
				want is already taken it's likely taken by you.
			</p>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					const secret = secretRef.current?.value;
					const username = userRef.current?.value;
					const password = passRef.current?.value;
					const name = nameRef.current?.value;
					if (!secret || !username || !password || !name) return;
					if (username.length > 24)
						return toast.error("Username can't be longer than 24 characters");
					if (!username.match(usernameRegex))
						return toast.error(
							'Username can only contain alphanumeric characters, dash, and underscore'
						);

					setLoading(true);
					createUserWithSecret(secret, username, password, name).catch(() => setLoading(false));
				}}
			>
				<Input ref={secretRef} title="Secret" width="wide" />
				<Input ref={userRef} title="Username" width="wide" />
				<Input ref={passRef} title="Password" type="password" width="wide" />
				<Input ref={nameRef} title="Name" width="wide" />
				<button type="submit" disabled={loading}>
					{loading ? <Spin /> : 'Create User'}
				</button>
			</form>
		</Page>
	);
}
