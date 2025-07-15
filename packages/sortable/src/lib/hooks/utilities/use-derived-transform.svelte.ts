import {getClientRect, type ClientRect} from '@dnd-kit-svelte/core';
import type {Transform} from '@dnd-kit-svelte/utilities';

interface Arguments {
	rect: ClientRect | null;
	disabled: boolean;
	index: number;
	node: HTMLElement | null;
}

/*
 * When the index of an item changes while sorting,
 * we need to temporarily disable the transforms
 *
 * TODO: revisit this this situation
 * I don't think this works in svelte - haniel
 */
export function useDerivedTransform(argsFn: () => Arguments) {
	const {rect, disabled, index, node} = $derived(argsFn());
	let derivedTransform = $state<Transform | null>(null);

	let previousIndex = index;

	$effect(() => {
		if (!disabled && index !== previousIndex && node) {
			const initial = rect;

			if (initial) {
				const current = getClientRect(node, {
					ignoreTransform: true,
				});

				const delta = {
					x: initial.left - current.left,
					y: initial.top - current.top,
					scaleX: initial.width / current.width,
					scaleY: initial.height / current.height,
				};

				if (delta.x || delta.y) {
					derivedTransform = delta;
				}
			}
		}

		if (index !== previousIndex) {
			previousIndex = index;
		}
	});

	$effect(() => {
		if (derivedTransform) {
			derivedTransform = null;
		}
	});

	return {
		get current() {
			return derivedTransform;
		},
	};
}
