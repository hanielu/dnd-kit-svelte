interface Arguments {
	callback: ResizeObserverCallback;
	disabled?: boolean;
}

/**
 * Returns a new ResizeObserver instance bound to the `onResize` callback.
 * If `ResizeObserver` is undefined in the execution environment, returns `undefined`.
 */
export function useResizeObserver(args: () => Arguments) {
	const {callback: handleResize, disabled} = $derived(args());
	const resizeObserver = $derived.by(() => {
		if (disabled || typeof window === 'undefined' || typeof window.ResizeObserver === 'undefined') {
			return undefined;
		}

		const {ResizeObserver} = window;

		return new ResizeObserver(handleResize);
	});

	$effect(() => {
		return () => resizeObserver?.disconnect();
	});

	return {
		get current() {
			return resizeObserver;
		},
	};
}
