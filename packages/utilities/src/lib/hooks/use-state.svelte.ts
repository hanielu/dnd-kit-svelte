export function useState<T>(initial: T) {
	let value = $state(initial);
	const read = () => value;
	const write = (val: T | ((prev: T) => T)) => {
		if (typeof val === 'function') {
			value = (val as (prev: T) => T)(value);
		} else {
			value = val;
		}
	};
	return [read, write];
}
