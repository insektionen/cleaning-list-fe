import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import type { MyUser } from './types';
import userApi from './user.api';
import { setAuthorizationToken } from '../util/axiosClient';
import Spin from '../components/Spin';
import ConditionalParent from '../components/ConditionalParent';

const LS_TOKEN_KEY = 'in-cleaning:token';
const USER_TOAST = 'user';

type UserContectProps = {
	// Conditions where user isn't defined should be so limited that front-end gets to deal with it.
	// This way all the components where we know that user is defined don't have to check for it.
	user: MyUser;
	signIn: (handle: string, password: string) => void;
	createUserWithSecret: (
		secret: string,
		handle: string,
		password: string,
		name: string
	) => Promise<void>;
	invalidateToken: () => void;
	updateUser: (newUser: MyUser) => void;
};

const UserContext = createContext<UserContectProps>({
	user: undefined as unknown as MyUser,
	signIn: () => {},
	createUserWithSecret: async () => {},
	invalidateToken: () => {},
	updateUser: () => {},
});

export const useUser = () => useContext(UserContext);

type UserProviderProps = {
	render?: (user?: MyUser) => ReactNode;
	providers?: (children: ReactNode) => ReactNode;
};

export function UserProvider({ render, providers }: UserProviderProps) {
	const [user, setUser] = useState<MyUser>();
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		setAuthorizationToken(user?.token.token);
	}, [user?.token.token]);

	async function getUser() {
		try {
			const user = await userApi.authenticate();
			setUser(user);
			toast.success(`Welcome back ${user.name}!`, { id: USER_TOAST });
		} catch (e) {
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		const token = localStorage.getItem(LS_TOKEN_KEY);
		if (!token) return setLoading(false);

		setAuthorizationToken(token);
		getUser();
	}, []);

	function signIn(username: string, password: string) {
		userApi
			.login(username, password)
			.then((user) => {
				toast.success(`Signed in as ${user.name}`);
				setUser(user);
				localStorage.setItem(LS_TOKEN_KEY, user.token.token);
				navigate('/');
			})
			.catch(() => {});
	}

	async function createUserWithSecret(
		secret: string,
		handle: string,
		password: string,
		name: string
	) {
		const user = await userApi.newUserFromSecret(secret, handle, password, name);
		toast.success(`Created user '${user.handle}'\n\nWait 3 seconds before you're redirected!`, {
			style: { textAlign: 'center' },
			duration: 3000,
		});
		localStorage.setItem(LS_TOKEN_KEY, user.token.token);
		setTimeout(() => {
			toast.success(`Signed in as ${user.name}`);
			setUser(user);
			navigate('/');
		}, 3000);
	}

	function invalidateToken() {
		localStorage.removeItem(LS_TOKEN_KEY);
		setAuthorizationToken();
		setUser(undefined);
		navigate('/');
	}

	function updateUser(newUser: MyUser) {
		setUser(newUser);
	}

	return (
		<UserContext.Provider
			value={
				{ user, signIn, createUserWithSecret, invalidateToken, updateUser } as UserContectProps
			}
		>
			{/* Here user is passed as `User | undefined`. */}
			{/* The render function has to make sure user is defined where it needs to be used */}
			<ConditionalParent condition={!!providers} parent={providers}>
				{loading ? <Spin size="large" /> : render?.(user)}
			</ConditionalParent>
		</UserContext.Provider>
	);
}
