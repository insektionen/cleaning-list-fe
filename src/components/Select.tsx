import { ReactNode } from 'react';

type SelectProps<T extends string> = {
	title?: string;
	value: T;
	options: (T | { key: T; display: ReactNode })[];
	onChange: (val: T) => void;
	width?: 'default' | 'full' | 'wide';
};

export default function Select<T extends string>({
	title,
	value,
	options,
	onChange,
	width = 'default',
}: SelectProps<T>) {
	return (
		<div
			className="select"
			style={{ minWidth: width === 'default' ? undefined : width === 'wide' ? '70%' : '100%' }}
		>
			{title && <label>{title}</label>}
			<div>
				<select value={value} onChange={(e) => onChange(e.target.value as T)}>
					{options.map((opt) =>
						typeof opt === 'string' ? (
							<option key={opt} value={opt}>
								{opt}
							</option>
						) : (
							<option key={opt.key} value={opt.key}>
								{opt.display}
							</option>
						)
					)}
				</select>
			</div>
		</div>
	);
}
