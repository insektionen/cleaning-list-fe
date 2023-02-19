import { useRef, useState } from 'react';

const DEFAULT_TIME = 500;

export default function useDebounce(defaultTime = DEFAULT_TIME) {
	const debounce = useRef<NodeJS.Timeout>();
	const startTime = useRef<number>();
	const pauseTime = useRef<number>();
	const action = useRef<() => Promise<void>>();

	const [loading, setLoading] = useState(false);

	function setDebounce(callback: () => Promise<void> | void, time = defaultTime) {
		if (debounce.current) clearTimeout(debounce.current);
		setLoading(true);
		startTime.current = Date.now();
		action.current = act(callback);
		debounce.current = setTimeout(action.current, time);
	}

	function clearDebounce() {
		if (debounce.current) clearTimeout(debounce.current);
		debounce.current = undefined;
		startTime.current = undefined;
		pauseTime.current = undefined;
		action.current = undefined;
		setLoading(false);
	}

	function pauseDebounce() {
		if (!debounce.current || !action.current) return false;

		pauseTime.current = Date.now();
		clearTimeout(debounce.current);
		debounce.current = undefined;

		return true;
	}

	function resumeDebounce(debounceTime?: number) {
		if (debounce.current || !startTime.current || !pauseTime.current || !action.current)
			return false;

		const newTime = debounceTime || pauseTime.current - startTime.current;
		startTime.current = Date.now();
		debounce.current = setTimeout(action.current, newTime);
		pauseTime.current = undefined;

		return true;
	}

	function act(callback: () => Promise<void> | void) {
		return async () => {
			debounce.current = undefined;
			startTime.current = undefined;
			pauseTime.current = undefined;

			await callback();

			action.current = undefined;
			setLoading(false);
		};
	}

	return {
		setDebounce,
		clearDebounce,
		pauseDebounce,
		resumeDebounce,
		active: !!debounce.current,
		loading,
	};
}
