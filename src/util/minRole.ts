import { Role } from '../user/types';

export const ROLE_ORDER: Role[] = ['BASE', 'MANAGER', 'MOD', 'ADMIN'];

export function roleAtLeast(role: Role, minimalRole: Role): boolean {
	const targetRoleValue = ROLE_ORDER.indexOf(role);
	const minRequiredValue = ROLE_ORDER.indexOf(minimalRole);

	return targetRoleValue >= minRequiredValue;
}
