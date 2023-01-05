import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Page from '../components/Page';
import Spin from '../components/Spin';
import userApi from '../user/user.api';
import { emailRegex } from '../util/regex';
import useInputRef from '../util/useInputRef';

export default function ForgotPassword() {
	const [loading, setLoading] = useState(false);
	const emailRef = useInputRef();
	const navigate = useNavigate();

	function submitResetRequest() {
		const email = emailRef.current?.value;
		if (!email) return toast.error('An email is required');
		if (!email.match(emailRegex)) return toast.error('Invalid email');

		setLoading(true);
		userApi
			.forgotPassword(email)
			.then(() => {
				toast.success("Email has been sent.\nYou'll be redirected in a second...");
				setTimeout(() => navigate('/password-reset'), 1_000);
			})
			.catch(() => setLoading(false));
	}

	return (
		<Page header="Forgot Password" headerColor="#ffc048">
			<p>
				If you've forgotten your password <em>and</em> have an email attached to your account you
				can get a token sent to you.
			</p>

			<Input ref={emailRef} title="Email" />
			<button style={{ marginTop: '0.75rem' }} onClick={submitResetRequest} disabled={loading}>
				{loading ? <Spin /> : 'Send email'}
			</button>
		</Page>
	);
}
