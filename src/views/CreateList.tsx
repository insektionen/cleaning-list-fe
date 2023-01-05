import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router';
import MenuItem from '../components/MenuItem';
import Page from '../components/Page';
import Spin from '../components/Spin';
import listApi from '../list/list.api';
import { Structure } from '../list/list.model';
import { Form, getForms } from '../util/forms';
import { useTranslate } from '../util/translation';

export default function CreateForm() {
	const navigate = useNavigate();
	const { loading: loadingTranslate, t } = useTranslate();

	const [loading, setLoading] = useState(true);
	const [forms, setForms] = useState<Form[]>();

	useEffect(() => {
		getForms()
			.then(setForms)
			.finally(() => setLoading(false));
	}, []);

	async function createList({ type, version, areas, colors }: Form) {
		if (!confirm(`Are you sure you want to create a new ${type} list?`)) return;

		setLoading(true);
		try {
			const structure: Structure = [];
			areas.forEach((area, areaIndex) => {
				structure[areaIndex] = { name: area.name, categories: [], comment: area.comment };
				area.categories.forEach((category, catIndex) => {
					structure[areaIndex].categories[catIndex] = { name: category.name, checks: [] };
					category.checks.forEach((check, checkIndex) => {
						structure[areaIndex].categories[catIndex].checks[checkIndex] = check;
					});
				});
			});

			const list = await listApi.createList(type, version, structure, colors);
			toast.success('Created a new list');
			navigate(`/lists/${list.id}`);
		} catch (e) {
		} finally {
			setLoading(false);
		}
	}

	return (
		<Page header="Create List" headerColor="#0be881" wideContent>
			{loading && loadingTranslate ? (
				<Spin size="medium" />
			) : forms ? (
				<ul>
					{forms.map((form) => (
						<MenuItem key={form.type} action={() => createList(form)}>
							{t(form.type, 'name')}
						</MenuItem>
					))}
				</ul>
			) : (
				'Something went wrong'
			)}
		</Page>
	);
}
