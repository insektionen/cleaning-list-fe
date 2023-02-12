import moment from 'moment';
import { CSSProperties, ForwardedRef, forwardRef, useState } from 'react';
import { toast } from 'react-hot-toast';

type DateString = `${number}-${number}-${number}`;

type DatePickerProps = {
	forwardedRef?: ForwardedRef<HTMLInputElement>;
	title?: string;
	value?: string | 'today';
	setValue?: (value: string) => void;
	min?: DateString;
	max?: DateString | 'today';
	required?: string;
	width?: 'default' | 'full' | 'wide' | 'flex';
	style?: CSSProperties;
};

function DatePicker({
	forwardedRef,
	title,
	value: superValue,
	setValue: setSuperValue,
	min,
	max,
	required = 'Date is required',
	width = 'default',
	style = {},
}: DatePickerProps) {
	const today = moment().format('YYYY-MM-DD');
	const [ownValue, setOwnValue] = useState(superValue === 'today' ? today : superValue ?? '');
	const [value, setValue] =
		superValue && superValue !== 'today' && setSuperValue
			? [superValue, setSuperValue]
			: [ownValue, setOwnValue];

	return (
		<div
			className="date-picker"
			style={{
				minWidth: width === 'wide' ? '70%' : width === 'full' ? '100%' : undefined,
				flex: width === 'flex' ? 1 : undefined,
				...style,
			}}
		>
			{title && <label>{title}</label>}
			<input
				ref={forwardedRef}
				type="date"
				min={min}
				max={max === 'today' ? today : max}
				value={value}
				onChange={(e) => {
					if (required && !e.target.value) return toast.error(required);
					setValue(e.target.value);
				}}
			/>
		</div>
	);
}

export default forwardRef<HTMLInputElement, Omit<DatePickerProps, 'forwardedRef'>>((props, ref) => (
	<DatePicker {...props} forwardedRef={ref} />
));
