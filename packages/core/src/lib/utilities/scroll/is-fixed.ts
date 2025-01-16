import {getWindow} from '@dnd-kit-svelte/utilities';

export function isFixed(
	node: HTMLElement,
	computedStyle: CSSStyleDeclaration = getWindow(node).getComputedStyle(node)
): boolean {
	return computedStyle.position === 'fixed';
}
