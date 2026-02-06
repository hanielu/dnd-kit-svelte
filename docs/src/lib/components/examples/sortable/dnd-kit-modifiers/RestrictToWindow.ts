import type {DragDropManager} from '@dnd-kit/dom';
import {Modifier, type DragOperation} from '@dnd-kit/abstract';
import {Rectangle, type BoundingRectangle} from '@dnd-kit/geometry';
import {effect, untracked} from '@dnd-kit/state';
import {getViewportBoundingRectangle} from '@dnd-kit/dom/utilities';
import {restrictShapeToBoundingRectangle} from '@dnd-kit/abstract/modifiers';

export class RestrictToWindow extends Modifier<DragDropManager> {
	constructor(manager: DragDropManager) {
		super(manager);

		const {dragOperation} = manager;

		const getWindowBoundingRectangle = () =>
			untracked(() => {
				const {source} = dragOperation;
				this.windowBoundingRectangle = getViewportBoundingRectangle(source?.element ?? document.documentElement);
			});

		console.log('before effect');
		const unsubscribe = effect(() => {
			if (dragOperation.status.idle) {
				console.log('idle');
				return () => {
					console.log('unsubscribe idle');
				};
			}

			console.log('effect');

			getWindowBoundingRectangle();

			window.addEventListener('resize', getWindowBoundingRectangle);

			return () => {
				console.log('unsubscribe resize');
				window.removeEventListener('resize', getWindowBoundingRectangle);
			};
		});

		this.destroy = () => {
			console.log('destroy');
			return unsubscribe;
		};
	}

	windowBoundingRectangle: BoundingRectangle | undefined;

	apply({shape, transform}: DragOperation) {
		if (!this.windowBoundingRectangle || !shape) {
			return transform;
		}

		const {initial, current} = shape;
		const {height, width} = current.boundingRectangle;
		const left = initial.center.x - width / 2;
		const top = initial.center.y - height / 2;

		const restrictedTransform = restrictShapeToBoundingRectangle(
			new Rectangle(left, top, width, height),
			transform,
			this.windowBoundingRectangle
		);

		return restrictedTransform;
	}
}
