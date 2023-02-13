import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Cog from '../icons/Cog';
import { User } from '../user/types';

type NavbarItemProps =
	| { to: string; children: ReactNode; icon?: undefined }
	| { to: string; children?: undefined; icon: JSX.Element };

function NavbarItem({ to, children, icon }: NavbarItemProps) {
	return (
		<Link to={to} relative="path">
			<li className={`navbar-item-${icon ? 'icon' : 'text'}`}>{icon ?? children}</li>
		</Link>
	);
}

type NavbarProps = {
	user?: User;
};

export default function Navbar({ user }: NavbarProps) {
	return (
		<div className="navbar">
			<ul>
				<div>
					<NavbarItem to="/">Home</NavbarItem>
				</div>
				{user && (
					<div>
						<NavbarItem to={`/users/${user.handle}`}>{user.name.split(' ')[0]}</NavbarItem>
						<NavbarItem to="/settings" icon={<Cog size="default" />} />
					</div>
				)}
			</ul>
		</div>
	);
}
