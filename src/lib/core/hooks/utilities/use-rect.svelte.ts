import type {ClientRect} from '../../types/index.js';
import {Rect, getClientRect} from '$lib/core/utilities/index.js';
import {useMutationObserver, useResizeObserver} from './index.js';

function defaultMeasure(element: HTMLElement) {
	return new Rect(getClientRect(element), element);
}

export function useRect(
	args: () => [
		element: HTMLElement | null,
		measure?: (element: HTMLElement) => ClientRect,
		fallbackRect?: ClientRect | null,
	]
) {
	let rect = $state<ClientRect | null>(null);
	const [element, measure = defaultMeasure, fallbackRect] = $derived.by(args);

	function measureRect() {
		if (!element) {
			rect = null;
			return;
		}

		if (element.isConnected === false) {
			// Fall back to last rect we measured if the element is
			// no longer connected to the DOM.
			rect = rect ?? fallbackRect ?? null;
			return;
		}

		const newRect = measure(element);

		if (JSON.stringify(rect) === JSON.stringify(newRect)) {
			return;
		}

		rect = newRect;
	}

	const mutationObserver = useMutationObserver(() => ({
		callback(records) {
			if (!element) {
				return;
			}

			for (const record of records) {
				const {type, target} = record;

				if (type === 'childList' && target instanceof HTMLElement && target.contains(element)) {
					measureRect();
					break;
				}
			}
		},
	}));

	const resizeObserver = useResizeObserver(() => ({callback: measureRect}));

	$effect(() => {
		measureRect();

		if (element) {
			resizeObserver.current?.observe(element);
			mutationObserver.current?.observe(document.body, {
				childList: true,
				subtree: true,
			});
		} else {
			resizeObserver.current?.disconnect();
			mutationObserver.current?.disconnect();
		}
	});

	return {
		get current() {
			return rect;
		},
	};
}
