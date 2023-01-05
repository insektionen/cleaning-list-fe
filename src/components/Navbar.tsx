import { ReactNode } from 'react';
import { Link, useLocation, useRoutes } from 'react-router-dom';
import { User } from '../user/types';
import { useUser } from '../user/user.context';

type NavbarItemProps =
	| { type?: 'icon' | 'text'; children: ReactNode; to: string; action?: undefined }
	| {
			type?: 'icon' | 'text';
			children: ReactNode;
			action: () => void;
			to?: undefined;
	  };

function NavbarItem({ type = 'text', to, action, children }: NavbarItemProps) {
	if (action) {
		return (
			<button onClick={action}>
				<li className={`navbar-item-${type}`}>{children}</li>
			</button>
		);
	} else {
		return (
			<Link to={to} relative="path">
				<li className={`navbar-item-${type}`}>{children}</li>
			</Link>
		);
	}
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
				<div>
					{user && <NavbarItem to={`/users/${user.handle}`}>{user.name.split(' ')[0]}</NavbarItem>}
				</div>
			</ul>
		</div>
	);
}
