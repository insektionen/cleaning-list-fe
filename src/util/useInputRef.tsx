import { useRef } from 'react';

export default function useInputRef() {
	const inputRef = useRef<HTMLInputElement>(null);

	return inputRef;
}
