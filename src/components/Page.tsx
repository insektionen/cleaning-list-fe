import { CSSProperties, ReactNode } from 'react';

type PageProps = {
	children?: ReactNode;
	header?: string;
	headerColor?: string;
	wideContent?: boolean;
	className?: string;
	style?: CSSProperties;
};

export default function Page({
	header,
	headerColor,
	wideContent = false,
	className = '',
	children,
}: PageProps) {
	return (
		<main>
			{header && <header style={{ backgroundColor: headerColor }}>{header}</header>}
			<div className={`content ${wideContent ? 'wide-content' : ''} ${className}`}>{children}</div>
		</main>
	);
}
