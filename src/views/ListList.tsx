import { useEffect, useState } from 'react';
import MenuItem from '../components/MenuItem';
import Page from '../components/Page';
import Spin from '../components/Spin';
import { MinimalList } from '../list/list.model';
import listApi from '../list/list.api';
import NotSubmitted from '../icons/NotSubmitted';
import Submitted from '../icons/Submitted';
import Verified from '../icons/Verified';
import { useTranslate } from '../util/translation';

function listIcon(list: MinimalList) {
	switch (list.status) {
		case 'open':
			return <NotSubmitted size="1.5rem" />;
		case 'submitted':
			return <Submitted size="1.5rem" />;
		case 'verified':
			return <Verified size="1.5rem" />;
	}
}

export default function UsersList() {
	const [loading, setLoading] = useState(true);
	const { loading: loadingTranslation, t } = useTranslate();
	const [lists, setLists] = useState<MinimalList[]>();

	useEffect(() => {
		listApi
			.findLists()
			.then(setLists)
			.finally(() => setLoading(false));
	}, []);

	return (
		<Page header="Lists" headerColor="#d1ccc0" wideContent>
			{loading ? (
				<Spin size="medium" className="self-center" style={{ margin: '2rem 0' }} />
			) : lists ? (
				<ul>
					{lists.map((list) => (
						<MenuItem key={list.id} to={`/lists/${list.id}`} icon={listIcon(list)}>
							<div className="flex-col" style={{ gap: '0.125rem' }}>
								<span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{t(list.type, 'name')}</span>
								{list.eventDate && <span>{list.eventDate}</span>}
							</div>
						</MenuItem>
					))}
				</ul>
			) : (
				'Something went wrong'
			)}
		</Page>
	);
}
