interface Arguments {
	callback: MutationCallback;
	disabled?: boolean;
}

/**
 * Returns a new MutationObserver instance.
 * If `MutationObserver` is undefined in the execution environment, returns `undefined`.
 */
export function useMutationObserver(args: () => Arguments) {
	const {callback: handleMutations, disabled} = $derived(args());
	const mutationObserver = $derived.by(() => {
		if (disabled || typeof window === 'undefined' || typeof window.MutationObserver === 'undefined') {
			return undefined;
		}

		const {MutationObserver} = window;

		return new MutationObserver(handleMutations);
	});

	$effect(() => {
		return () => mutationObserver?.disconnect();
	});

	return {
		get current() {
			return mutationObserver;
		},
	};
}
