import type {ClientRect, UniqueIdentifier, UseDndContextReturnValue} from '$core/index.js';

export function getSortedRects(items: UniqueIdentifier[], rects: UseDndContextReturnValue['droppableRects']) {
	return items.reduce<ClientRect[]>((accumulator, id, index) => {
		if (!rects) return accumulator;
		const rect = rects.get(id);
		if (rect) {
			accumulator[index] = rect;
		}

		return accumulator;
	}, Array(items.length));
}
