import { ReactNode } from 'react';

type DetailsRowProps = {
	title: string;
	displayValue?: ReactNode;
	editing?: boolean;
	editContent?: ReactNode;
};

export default function DetailsRow({ title, displayValue, editing, editContent }: DetailsRowProps) {
	return (
		<>
			<dt>{title}</dt>
			<dd>{editing ? editContent : <span style={{ flex: 1 }}>{displayValue ?? <b>–</b>}</span>}</dd>
		</>
	);
}
