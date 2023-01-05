import MenuItem from '../components/MenuItem';
import Page from '../components/Page';
import { useUser } from '../user/user.context';
import { roleAtLeast } from '../util/minRole';

export default function Home() {
	const { user } = useUser();

	return (
		<Page header="Home" headerColor="#6f76de" wideContent>
			<ul>
				<MenuItem to="/create-list">Create Lists</MenuItem>
				<MenuItem to="/lists">View Lists</MenuItem>
				{roleAtLeast(user.role, 'MOD') && <MenuItem to="/create-user">Create User</MenuItem>}
				{roleAtLeast(user.role, 'MOD') && <MenuItem to="/users">Manage Users</MenuItem>}
				{user.role === 'ADMIN' && <MenuItem to="/generate-secret">Generate New Secret</MenuItem>}
			</ul>
		</Page>
	);
}
