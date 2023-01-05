type CheckboxProps = {
	label: string;
	value?: boolean;
	onChange?: () => void;
	disabled?: boolean;
	color?: string;
	labelColor?: string;
	borderColor?: string;
};

export default function Checkbox({
	label,
	value,
	onChange,
	disabled,
	color = '#3498db',
	labelColor = 'white',
	borderColor = labelColor,
}: CheckboxProps) {
	return (
		<label className="checkbox" style={{ fontSize: '1.1rem' }}>
			<input type="checkbox" checked={value} onChange={onChange} disabled={disabled} />
			<span className="checkmark" style={{ borderColor }}>
				<span style={{ color, borderColor }} />
			</span>
			<span className="label" style={{ color: labelColor }}>
				{label}
			</span>
		</label>
	);
}
