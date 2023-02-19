import { CSSProperties, ReactNode } from 'react';
import classes from '../util/classes';

type ExpandableProps = {
	/**
	 * Defines wheter or not the contents are visible
	 */
	visible?: boolean;
	/**
	 * Minimum expected height, used to make transition smooth
	 */
	expectedMinHeight?: string | number;
	style?: CSSProperties;
	children: ReactNode;
};

export default function Expandable({
	visible = false,
	expectedMinHeight,
	style,
	children,
}: ExpandableProps) {
	return (
		<div
			className={classes('expandable', visible || 'hidden')}
			style={{ ...style, maxHeight: expectedMinHeight }}
		>
			{children}
		</div>
	);
}
