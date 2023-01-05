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
	submitted: boolean;
	verified: boolean;
	createdBy: MinimalUser;
};

export type MinimalList = Omit<
	List,
	'structure' | 'fields' | 'colors' | 'responsible' | 'phoneNumber' | 'comment' | 'createdBy'
>;

export type Structure = {
	name: string;
	categories: { name: string | 'all' | 'lasts'; checks: string[] }[];
	comment?: string;
}[];
