import { AxiosError } from 'axios';
import { ReactNode, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../user/user.context';
import { setErrorInterceptor } from '../util/axiosClient';

export default function ApiErrorManager({ children }: { children: ReactNode }) {
	const navigate = useNavigate();
	const { invalidateToken } = useUser();

	useEffect(() => {
		setErrorInterceptor(errorManager);
	}, [errorManager]);

	function errorManager(error: AxiosError['response']) {
		if (
			(error?.status === 401 && !error?.request?.responseURL?.endsWith('/user/login')) ||
			(error?.status === 404 && error.data === 'No user with that token exists')
		) {
			invalidateToken();
			navigate('/');
		}

		const errorMessage = error?.data as string;
		if (typeof errorMessage === 'string') {
			toast.error(errorMessage);
		}
	}

	return <>{children}</>;
}
