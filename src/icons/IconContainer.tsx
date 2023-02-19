import { CSSProperties, PropsWithChildren } from 'react';

export type IconProps = {
	size?: string | number;
	style?: CSSProperties;
	className?: string;
};

export default function IconContainer({
	size = '1em',
	style = {},
	className = '',
	children,
}: PropsWithChildren<IconProps>) {
	return (
		<div className={`icon ${className}`} style={{ ...style, fontSize: size }}>
			{children}
		</div>
	);
}
