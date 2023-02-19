import client from '../util/axiosClient';
import { MinimalUser, MyUser, Role, User } from './types';

type UpdateUserParams = {
	name?: string;
	email?: string;
	role?: Role;
	password?: string;
	currentPassword?: string;
};

type FindUsersParams = {
	limit?: number;
	page?: number;
	search?: string;
};

export async function login(username: string, password: string): Promise<MyUser> {
	return await client.post<MyUser>(`/users/login`, { username, password }).then(({ data }) => data);
}

export async function authenticate(): Promise<MyUser> {
	return await client.get<MyUser>('/authenticate').then(({ data }) => data);
}

export async function newUser(
	handle: string,
	password: string,
	name: string,
	role: Role
): Promise<User> {
	return client.post<User>('/users', { handle, password, name, role }).then(({ data }) => data);
}

export async function newUserFromSecret(
	secret: string,
	handle: string,
	password: string,
	name: string
): Promise<MyUser> {
	return await client
		.post<MyUser>(
			'/users/secret',
			{ handle, password, name },
			{ headers: { Authorization: secret } }
		)
		.then(({ data }) => data);
}

export async function updateUser(
	handle: string,
	params: UpdateUserParams,
	myUser: true
): Promise<MyUser>;
export async function updateUser(
	handle: string,
	params: UpdateUserParams,
	myUser: false
): Promise<User>;
export async function updateUser(
	handle: string,
	params: UpdateUserParams,
	myUser?: undefined
): Promise<User>;
export async function updateUser(
	handle: string,
	params: UpdateUserParams,
	myUser: boolean = false
): Promise<User | MyUser> {
	if (!myUser) return await client.patch<User>(`/users/${handle}`, params).then(({ data }) => data);
	return await client.patch<MyUser>(`/users/${handle}`, params).then(({ data }) => data);
}

export async function newUserGeneratorSecret(password: string): Promise<string> {
	return await client.post<string>('/users/new-secret', { password }).then(({ data }) => data);
}

export async function findUsers(params?: FindUsersParams): Promise<MinimalUser[]> {
	return await client.get<MinimalUser[]>('/users', { params }).then(({ data }) => data);
}

export async function findUser(handle: string): Promise<User> {
	return await client.get<User>(`/users/${handle}`).then(({ data }) => data);
}

export async function forgotPassword(email: string) {
	await client.post('/users/forgot-password', { email });
}

export async function resetPassword(token: string, password: string) {
	await client.post('/users/reset-password', { token, password });
}

export default {
	login,
	authenticate,
	newUser,
	newUserFromSecret,
	updateUser,
	newUserGeneratorSecret,
	findUsers,
	findUser,
	forgotPassword,
	resetPassword,
};
