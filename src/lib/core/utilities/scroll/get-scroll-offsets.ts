import {add} from '$utilities';

import type {Coordinates} from '../../types/index.js';
import {getScrollCoordinates, getScrollXCoordinate, getScrollYCoordinate} from './get-scroll-coordinates.js';
import {defaultCoordinates} from '../coordinates/index.js';

export function getScrollOffsets(scrollableAncestors: Element[]): Coordinates {
	return scrollableAncestors.reduce<Coordinates>((acc, node) => {
		return add(acc, getScrollCoordinates(node));
	}, defaultCoordinates);
}

export function getScrollXOffset(scrollableAncestors: Element[]): number {
	return scrollableAncestors.reduce<number>((acc, node) => {
		return acc + getScrollXCoordinate(node);
	}, 0);
}

export function getScrollYOffset(scrollableAncestors: Element[]): number {
	return scrollableAncestors.reduce<number>((acc, node) => {
		return acc + getScrollYCoordinate(node);
	}, 0);
}
