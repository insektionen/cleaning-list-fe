export type Form = {
	type: string;
	version: string;
	areas: {
		name: string;
		categories: { name: string; checks: string[] }[];
		comment?: string;
	}[];
	colors?: Record<string, string>;
};

export type FormStore = Record<string, Form & { sortWeight: number }>;

let storedForms: FormStore;

export async function getForms(): Promise<Form[]> {
	if (storedForms) return sortForms(storedForms);

	const files = import.meta.glob('../assets/forms/*.json');

	storedForms = {};
	for (const name in files) {
		const { type, version, sortWeight, areas, colors } = (await files[name]()) as Form & {
			sortWeight?: number;
		};
		storedForms[type] = { type, version, sortWeight: sortWeight ?? 0, areas, colors };
	}

	return sortForms(storedForms);
}

export async function getForm(type: string): Promise<Form | null> {
	if (!storedForms) await getForms();

	const storedForm = storedForms[type];
	const { sortWeight, ...rest } = storedForm ?? {};

	return storedForm ? rest : null;
}

function sortForms(forms: FormStore): Form[] {
	return Object.values(forms)
		.sort((a, b) => a.type.localeCompare(b.type))
		.sort((a, b) => a.sortWeight - b.sortWeight)
		.map(({ sortWeight, ...rest }) => rest);
}
