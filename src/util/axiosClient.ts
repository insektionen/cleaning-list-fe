import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

const client = axios.create({
	baseURL: import.meta.env.PROD ? globalThis.API_BASE_URL : import.meta.env.VITE_API_BASE_URL,
});

let tokenInterceptor: number | null = null;

export function setAuthorizationToken(token?: string) {
	if (tokenInterceptor != null) {
		client.interceptors.request.eject(tokenInterceptor);
	}

	tokenInterceptor = client.interceptors.request.use((config) => {
		if (config.headers) {
			config.headers.Authorization = token ?? config.headers.Authorization;
		}
		return config;
	});
}

let errorInterceptor: number | null = null;

export function setErrorInterceptor(errorCallback: (error: AxiosError['response']) => void) {
	removeErrorInterceptor();

	errorInterceptor = client.interceptors.response.use(
		(response) => response,
		(error: AxiosError) => {
			if (error.code === 'ERR_NETWORK') toast.error('Could not connect to the backend');
			errorCallback(error.response);
			throw error;
		}
	);
}

export function removeErrorInterceptor() {
	if (errorInterceptor != null) {
		client.interceptors.response.eject(errorInterceptor);
		errorInterceptor = null;
	}
}

export default client;
