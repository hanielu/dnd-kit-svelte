import {getScrollableAncestors} from '$core/utilities/index.js';
import {useLazyMemo} from '@dnd-kit-svelte/utilities';

const defaultValue: Element[] = [];

function arraysShallowEqual(a: Element[], b: Element[]) {
	return a.length === b.length && a.every((el, i) => el === b[i]);
}

export function useScrollableAncestors(nodeFn: () => HTMLElement | null) {
	const node = $derived(nodeFn());
	let previousNode = node;

	const ancestors = useLazyMemo<Element[]>((previousValue) => {
		if (!node) {
			return defaultValue;
		}

		if (
			previousValue &&
			Array.isArray(previousValue) &&
			!arraysShallowEqual(previousValue, defaultValue) &&
			node &&
			previousNode &&
			node.parentNode === previousNode.parentNode
		) {
			return previousValue;
		}

		return getScrollableAncestors(node);
	});

	$effect(() => {
		previousNode = node;
	});

	return ancestors;
}
