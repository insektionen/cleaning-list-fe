import { CSSProperties, PropsWithChildren } from 'react';

export type IconProps = {
	size: string | number;
	style?: CSSProperties;
};

export default function IconContainer({
	size,
	style = {},
	children,
}: PropsWithChildren<IconProps>) {
	return (
		<div className="icon" style={{ ...style, fontSize: size }}>
			{children}
		</div>
	);
}
