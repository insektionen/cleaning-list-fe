import { MinimalUser } from '../user/types';

export type List = {
	id: number;
	type: string;
	version: string;
	structure: Structure;
	fields: Record<string, boolean>;
	colors: Record<string, string> | null;
	responsible: string | null;
	phoneNumber: string | null;
	eventDate: string | null;
	comment: string | null;
	status: ListStatus;
	submittedAt: Date | null;
	verified: ListVerification | null;
	createdBy: MinimalUser;
	ownedBy: MinimalUser;
};

export type MinimalList = Omit<
	List,
	| 'structure'
	| 'fields'
	| 'colors'
	| 'responsible'
	| 'phoneNumber'
	| 'comment'
	| 'createdBy'
	| 'ownedBy'
>;

export type ListStatus = 'open' | 'submitted' | 'verified';

export type ListVerification = {
	verifiedAt: Date;
	verifiedBy: MinimalUser;
};

export type Structure = {
	name: string;
	categories: { name: string | 'all' | 'lasts'; checks: string[] }[];
	comment?: string;
}[];
