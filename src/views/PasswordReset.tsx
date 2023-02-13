import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../components/Input';
import Page from '../components/Page';
import Spin from '../components/Spin';
import userApi from '../user/user.api';

export default function PasswordReset() {
	const [searchParams] = useSearchParams();
	const [token, setToken] = useState(searchParams.get('token') ?? '');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	function resetPassword() {
		if (!token) return toast.error('No token provided');
		if (!password) return toast.error('No new password provided');

		setLoading(true);
		userApi
			.resetPassword(token, password)
			.then(() => {
				toast.success("Successfully reset password.\nYou'll be redirected in a second...");
				setTimeout(() => navigate('/'), 1_000);
			})
			.catch(() => setLoading(false));
	}

	return (
		<Page header="Password Reset" headerColor="#273c75">
			<Input title="Reset Token" value={token} onChange={setToken} />
			<Input title="New Password" value={password} onChange={setPassword} type="password" />
			<button style={{ marginTop: '0.75rem' }} onClick={resetPassword} disabled={loading}>
				{loading ? <Spin /> : 'Reset Password'}
			</button>
		</Page>
	);
}
