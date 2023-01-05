import { CSSProperties } from 'react';

type SpinProps = {
	size?: 'default' | 'large' | 'medium';
	className?: string;
	style?: CSSProperties;
};

export default function Spin({ size = 'default', className = '', style }: SpinProps) {
	return <span className={`spin-loader ${size} ${className}`} style={style} />;
}
