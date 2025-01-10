import type {ClientRect} from '../../types/index.js';
import {getScrollableAncestors, getScrollOffsets, getScrollXOffset, getScrollYOffset} from '../scroll/index.js';

const properties = [
	['x', ['left', 'right'], getScrollXOffset],
	['y', ['top', 'bottom'], getScrollYOffset],
] as const;

export class Rect {
	constructor(rect: ClientRect, element: Element) {
		const scrollableAncestors = getScrollableAncestors(element);
		const scrollOffsets = getScrollOffsets(scrollableAncestors);

		this.rect = {...rect};
		this.width = rect.width;
		this.height = rect.height;

		for (const [axis, keys, getScrollOffset] of properties) {
			for (const key of keys) {
				Object.defineProperty(this, key, {
					get: () => {
						const currentOffsets = getScrollOffset(scrollableAncestors);
						const scrollOffsetsDeltla = scrollOffsets[axis] - currentOffsets;

						return this.rect[key] + scrollOffsetsDeltla;
					},
					enumerable: true,
				});
			}
		}

		Object.defineProperty(this, 'rect', {enumerable: false});
	}

	private rect: ClientRect;

	public width: number;

	public height: number;

	// The below properties are set by the `Object.defineProperty` calls in the constructor
	// @ts-expect-error Property has no initializer and is not definitely assigned in the constructor
	public top: number;
	// @ts-expect-error Property has no initializer and is not definitely assigned in the constructor
	public bottom: number;
	// @ts-expect-error Property has no initializer and is not definitely assigned in the constructor
	public right: number;
	// @ts-expect-error Property has no initializer and is not definitely assigned in the constructor
	public left: number;
}
