import {untrack} from 'svelte';

export function useLazyMemo<T>(fn: (prevValue: T | undefined) => T) {
	let current = $state<T>();

	$effect(() => {
		current = fn(untrack(() => current));
	});

	return {
		get current() {
			return current as T;
		},
	};
}
