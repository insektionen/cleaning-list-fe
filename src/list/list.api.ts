import client from '../util/axiosClient';
import { List, MinimalList, Structure } from './list.model';

type UpdateListProps = {
	fields?: List['fields'];
	responsible?: string;
	phoneNumber?: string;
	eventDate?: string;
	owner?: string;
	comment?: string | null;
	submit?: true;
	verify?: true;
};

export async function findLists(): Promise<MinimalList[]> {
	return await client.get<MinimalList[]>('/lists').then(({ data }) => data);
}

export async function findList(id: number): Promise<List> {
	return await client.get<List>(`/lists/${id}`).then(({ data }) => data);
}

export async function createList(
	type: string,
	version: string,
	structure: Structure,
	colors?: Record<string, string>
): Promise<List> {
	return await client
		.post<List>('/lists', { type, version, structure, colors })
		.then(({ data }) => data);
}

export async function updateList(
	id: number,
	{ submit: submitted, verify: verified, ...props }: UpdateListProps
): Promise<List> {
	return await client
		.patch<List>(`/lists/${id}`, { ...props, submitted, verified })
		.then(({ data }) => data);
}

export default {
	findLists,
	findList,
	createList,
	updateList,
};
