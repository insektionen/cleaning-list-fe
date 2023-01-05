import { useEffect, useState } from 'react';
import MenuItem from '../components/MenuItem';
import Page from '../components/Page';
import Spin from '../components/Spin';
import { MinimalUser } from '../user/types';
import userApi from '../user/user.api';

export default function UsersList() {
	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState<MinimalUser[]>();

	useEffect(() => {
		userApi
			.findUsers()
			.then(setUsers)
			.finally(() => setLoading(false));
	}, []);

	return (
		<Page header="Manage Users" headerColor="#d1ccc0" wideContent>
			{loading ? (
				<Spin size="medium" className="self-center" style={{ margin: '2rem 0' }} />
			) : users ? (
				<ul>
					{users.map((user) => (
						<MenuItem key={user.handle} to={`/users/${user.handle}`} className="gap-1">
							<span>{user.name}</span>
							<span style={{ opacity: 0.6 }}>@{user.handle}</span>
						</MenuItem>
					))}
				</ul>
			) : (
				'Something went wrong'
			)}
		</Page>
	);
}
