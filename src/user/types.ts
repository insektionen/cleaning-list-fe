export type User = {
	handle: string;
	name: string;
	role: Role;
	email?: string;
};

export type MyUser = User & { token: UserToken };

export type MinimalUser = Omit<User, 'token' | 'email'>;

export type UserToken = {
	token: string;
	expiresAt: Date;
};

export type Role = 'ADMIN' | 'MOD' | 'MANAGER' | 'BASE';
