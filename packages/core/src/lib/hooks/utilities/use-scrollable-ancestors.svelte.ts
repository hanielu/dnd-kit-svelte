import {getScrollableAncestors} from '$core/utilities/index.js';
import {useLazyMemo} from '@dnd-kit-svelte/utilities';

const defaultValue: Element[] = [];

export function useScrollableAncestors(nodeFn: () => HTMLElement | null) {
	const node = $derived(nodeFn());
	let previousNode = node;

	const ancestors = useLazyMemo<Element[]>((previousValue) => {
		if (!node) {
			return defaultValue;
		}

		if (
			previousValue &&
			previousValue !== defaultValue &&
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
