import { ReactNode } from 'react';
import Input from './Input';

type DetailsRowProps<T extends string> =
	| {
			title: string;
			currentValue?: string;
			displayValue?: ReactNode;
			editable?: false | undefined;
			value?: T | undefined;
			onChange?: (val?: T) => void;
	  }
	| {
			title: string;
			currentValue?: string;
			displayValue?: ReactNode;
			editable: 'input' | 'select';
			value: T | undefined;
			onChange: (val?: T) => void;
	  };

export default function DetailsRow<T extends string>({
	title,
	currentValue,
	displayValue = currentValue,
	editable,
	value,
	onChange,
}: DetailsRowProps<T>) {
	return (
		<>
			<dt>{title}</dt>
			<dd>
				{!editable ? (
					<span style={{ flex: 1 }}>{displayValue ?? <b>–</b>}</span>
				) : editable === 'input' ? (
					<Input
						value={value ?? currentValue ?? ''}
						onChange={(val) => onChange!(val !== currentValue ? (val as T) : undefined)}
						width="wide"
						style={{ margin: 0 }}
					/>
				) : (
					'Select'
				)}
			</dd>
		</>
	);
}
