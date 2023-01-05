import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import Input from '../components/Input';
import Page from '../components/Page';
import Spin from '../components/Spin';
import userApi from '../user/user.api';
import useInputRef from '../util/useInputRef';

export default function NewUserGenerateSecret() {
	const [hasAccepted, setHasAccepted] = useState(false);
	const [loadingSecret, setLoadingSecret] = useState(false);
	const passwordRef = useInputRef();
	const [newSecret, setNewSecret] = useState<string>();

	async function createNewSecret() {
		const password = passwordRef.current?.value;
		if (!password) return toast.error('Password is required to reset secret');

		setLoadingSecret(true);
		try {
			const secret = await userApi.newUserGeneratorSecret(password);
			setNewSecret(secret);
		} catch (e) {
		} finally {
			setLoadingSecret(false);
		}
	}

	return (
		<Page header="New Secret" headerColor="#ff5e57" className="text-box">
			<p>
				This action should not be taken lightly. The secret is required to create a new user without
				the help of an existing user. If someone needs to become a user and the secret is
				inaccessable, the only solution is asking a moderator for help.
			</p>
			<p>
				The secret must be posted somewhere where all those who need access to this app can read it.
				As the one resetting the secret you have a <b>personal responsibility</b> to make sure that
				the new secret is posted where it needs to be.
			</p>
			<p>It's tracked which user has generated the token, abuse will be reprimanded.</p>

			{newSecret ? (
				<>
					<p>
						A new token has been generated. It cannot be made visable again after you leave this
						page, it's not even known by the server, so do not lose it! You can <b>click</b> on it
						to copy it to your clipboard.
					</p>
					<h2 className="self-center" style={{ margin: '0.5rem' }}>
						New secret:
					</h2>
					<pre
						className="clickable"
						onClick={() =>
							navigator.clipboard
								.writeText(newSecret)
								.then(() => toast.success('Copied secret to clipboard'))
						}
					>
						{newSecret}
					</pre>
				</>
			) : hasAccepted ? (
				<>
					<p>
						Once you are absolutely sure that you want to generate a new secret; press the button
						below.
					</p>
					<Input title="Password" ref={passwordRef} type="password" width="full" />
					<button className="self-center" onClick={createNewSecret} disabled={loadingSecret}>
						{loadingSecret ? <Spin /> : 'Generate new token'}
					</button>
				</>
			) : (
				<button className="self-center" onClick={() => setHasAccepted(true)}>
					I Accept
				</button>
			)}
		</Page>
	);
}
