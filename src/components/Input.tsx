import { CSSProperties, ForwardedRef, forwardRef, HTMLInputTypeAttribute, RefObject } from 'react';

type InputProps = {
	title?: string;
	type?: HTMLInputTypeAttribute;
	forwardedRef?: ForwardedRef<HTMLInputElement>;
	value?: string;
	onChange?: (value: string) => void;
	width?: 'default' | 'full' | 'wide' | 'flex';
	style?: CSSProperties;
};

function Input({
	title,
	type,
	forwardedRef,
	value,
	onChange,
	width = 'default',
	style = {},
}: InputProps) {
	return (
		<div
			className="input"
			style={{
				minWidth: width === 'wide' ? '70%' : width === 'full' ? '100%' : undefined,
				flex: width === 'flex' ? 1 : undefined,
				...style,
			}}
		>
			{title && <label>{title}</label>}
			<input
				type={type}
				ref={forwardedRef}
				value={value}
				onChange={onChange && ((e) => onChange(e.target.value))}
			/>
		</div>
	);
}

export default forwardRef<HTMLInputElement, Omit<InputProps, 'forwardedRef'>>((props, ref) => (
	<Input {...props} forwardedRef={ref} />
));
