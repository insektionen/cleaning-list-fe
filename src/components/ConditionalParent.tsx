import { ReactNode } from 'react';

type ConditionalParentProps = {
	condition?: any;
	parent?: (children: ReactNode) => ReactNode;
	children: ReactNode;
};

export default function ConditionalParent({ condition, parent, children }: ConditionalParentProps) {
	return <>{condition ? parent?.(children) : children}</>;
}
