import { configurator, Modifier } from "@dnd-kit/abstract";
import type { DragDropManager } from "@dnd-kit/dom";
import { DOMRectangle } from "@dnd-kit/dom/utilities";

type Operation = Parameters<Modifier["apply"]>[0];
type Point = ReturnType<Modifier["apply"]>;
type Box = { center: Point; left: number; top: number; width: number; height: number };

/**
 * A modifier that places the dragged element relative to the pointer. The source's box is measured once per drag,
 * because the pointer position and that box must share a coordinate space; `place` then returns the transform.
 */
abstract class CursorModifier extends Modifier<DragDropManager> {
	#box: Box | undefined;

	protected abstract place(pointer: Point, box: Box): Point;

	apply(operation: Operation): Point {
		const { position, shape, source, transform } = operation;

		if (this.manager.dragOperation.status.idle) {
			this.#box = undefined;
			return transform;
		}

		this.#box ??= measure(shape?.initial.boundingRectangle ?? (source?.element && new DOMRectangle(source.element)));
		return this.#box ? this.place(position.current, this.#box) : transform;
	}
}

function measure(rect: Omit<Box, "center"> | undefined | null): Box | undefined {
	if (!rect) return;
	const { left, top, width, height } = rect;
	return { left, top, width, height, center: { x: left + width / 2, y: top + height / 2 } };
}

/** Puts the dragged element's top-left corner at the pointer. */
export class AlignTopLeftToCursor extends CursorModifier {
	protected place(pointer: Point, box: Box) {
		return { x: pointer.x - box.left, y: pointer.y - box.top };
	}

	static configure = configurator(AlignTopLeftToCursor);
}

/** Centers the dragged element on the pointer. */
export class SnapCenterToCursor extends CursorModifier {
	protected place(pointer: Point, box: Box) {
		return { x: pointer.x - box.center.x, y: pointer.y - box.center.y };
	}

	static configure = configurator(SnapCenterToCursor);
}

const GAP = 4;

/** Puts the dragged element just below and to the right of the pointer, like a cursor badge. */
export class OffsetBottomRight extends CursorModifier {
	protected place(pointer: Point, box: Box) {
		return {
			x: pointer.x - box.center.x + box.width / 2 + GAP,
			y: pointer.y - box.center.y + box.height / 2 + GAP,
		};
	}

	static configure = configurator(OffsetBottomRight);
}
