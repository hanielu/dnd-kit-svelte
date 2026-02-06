import {Modifier, configurator} from '@dnd-kit/abstract';
import type {DragDropManager} from '@dnd-kit/dom';
import {DOMRectangle} from '@dnd-kit/dom/utilities';

export class AlignTopLeftToCursor extends Modifier<DragDropManager> {
	private baseTopLeft: {x: number; y: number} | undefined;

	apply(operation: DragDropManager['dragOperation']) {
		const {position, shape, source, transform, status} = operation;

		// Reset per drag end
		// @ts-expect-error - snapshot(Status) exposes `.value`
		if (status.value === 'idle') {
			this.baseTopLeft = undefined;
			return transform;
		}

		if (!this.baseTopLeft) {
			// Establish baseline top-left in the same coord space as position
			if (shape?.initial) {
				const r = shape.initial.boundingRectangle;
				this.baseTopLeft = {x: r.left, y: r.top};
			} else if (source?.element) {
				const r = new DOMRectangle(source.element);
				this.baseTopLeft = {x: r.left, y: r.top};
			} else {
				return transform;
			}
		}

		// Absolute transform: place element's top-left at the pointer position
		return {
			x: position.current.x - this.baseTopLeft.x,
			y: position.current.y - this.baseTopLeft.y,
		};
	}

	static configure = configurator(AlignTopLeftToCursor);
}

export class SnapCenterToCursor extends Modifier<DragDropManager> {
	private baseCenter: {x: number; y: number} | undefined;

	apply(operation: DragDropManager['dragOperation']) {
		const {position, shape, source, transform, status} = operation;

		// @ts-expect-error this is the only way to get the status
		// for some reason it's the only field, even though the types say otherwise
		if (status.value === 'idle') {
			this.baseCenter = undefined;
			return transform;
		}

		if (!this.baseCenter) {
			// Lock baseline center ONCE in the same coord space as position
			const center = shape?.initial?.center ?? (source?.element ? new DOMRectangle(source.element).center : null);

			if (!center) {
				return transform;
			}
			this.baseCenter = center;
		}

		// Absolute transform: pointer - baseline center
		return {
			x: position.current.x - this.baseCenter.x,
			y: position.current.y - this.baseCenter.y,
		};
	}

	static configure = configurator(SnapCenterToCursor);
}

const GAP = 4;

export class OffsetBottomRight extends Modifier<DragDropManager> {
	private baseCenter: {x: number; y: number} | undefined;
	private half: {x: number; y: number} | undefined;

	apply(operation: DragDropManager['dragOperation']) {
		const {position, shape, source, transform, status} = operation;

		// @ts-expect-error snapshot(Status) exposes `.value`
		if (status.value === 'idle') {
			this.baseCenter = undefined;
			this.half = undefined;
			return transform;
		}

		if (!this.baseCenter || !this.half) {
			let center: {x: number; y: number} | undefined;
			let width: number | undefined;
			let height: number | undefined;

			if (shape?.initial) {
				center = shape.initial.center;
				const rect = shape.initial.boundingRectangle;
				width = rect.width;
				height = rect.height;
			} else if (source?.element) {
				const rect = new DOMRectangle(source.element);
				center = rect.center;
				width = rect.width;
				height = rect.height;
			} else {
				return transform;
			}

			this.baseCenter = center;
			this.half = {x: width! / 2 + GAP, y: height! / 2 + GAP};
		}

		// Absolute transform: pointer - baseline center + half-size + gap
		return {
			x: position.current.x - this.baseCenter.x + this.half.x,
			y: position.current.y - this.baseCenter.y + this.half.y,
		};
	}

	static configure = configurator(OffsetBottomRight);
}
