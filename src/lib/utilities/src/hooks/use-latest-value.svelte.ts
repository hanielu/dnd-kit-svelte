type DependencyList = () => any[];

export function useLatestValue<T>(value: T, dependencies: DependencyList) {
	let valueRef: T = $state(value);

	$effect(() => {
		dependencies(); // trigger re-run

		if (valueRef !== value) {
			valueRef = value;
		}
	});

	return {
		get current() {
			return valueRef;
		},
	};
}
