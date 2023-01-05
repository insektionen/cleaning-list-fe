import { ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type MenuItemProps = { icon?: ReactElement; className?: string; children?: ReactNode } & (
	| { to: string; action?: undefined }
	| { to?: undefined; action: () => void }
);

export default function MenuItem({ icon, className, to, action, children }: MenuItemProps) {
	return action ? (
		<button onClick={() => action()} className="menu-item">
			<li>
				<div className={className}>
					{icon}
					{children}
				</div>
			</li>
		</button>
	) : (
		<Link to={to} className="menu-item">
			<li>
				<div className={className}>
					{icon}
					{children}
				</div>
			</li>
		</Link>
	);
}
