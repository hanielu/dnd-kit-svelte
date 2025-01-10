export function useInterval() {
	let intervalRef: number | null = null;

	const set = (listener: Function, duration: number) => {
		intervalRef = setInterval(listener, duration);
	};

	const clear = () => {
		if (intervalRef !== null) {
			clearInterval(intervalRef);
			intervalRef = null;
		}
	};

	return [set, clear] as const;
}
