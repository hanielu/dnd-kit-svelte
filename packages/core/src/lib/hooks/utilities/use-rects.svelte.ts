import type {ClientRect} from '../../types/index.js';
import {getClientRect, isDocumentScrollingElement, Rect} from '$core/utilities/index.js';
import {getWindow} from '@dnd-kit-svelte/utilities';
import {useResizeObserver} from './index.js';
import {useWindowRect} from './use-window-rect.svelte.js';

const defaultValue: Rect[] = [];

export function useRects(args: () => [elements: Element[], measure?: (element: Element) => ClientRect]) {
	const [elements = [], measure = getClientRect] = $derived(args());
	const [firstElement] = $derived(elements);
	const windowRect = useWindowRect(() => (firstElement ? getWindow(firstElement) : null));
	let rects = $state<ClientRect[]>(defaultValue);

	function measureRects() {
		if (!elements.length) {
			rects = defaultValue;
			return;
		}

		rects = elements.map((element) =>
			isDocumentScrollingElement(element) ? (windowRect.current as ClientRect) : new Rect(measure(element), element)
		);
	}

	const resizeObserver = useResizeObserver(() => ({callback: measureRects}));

	$effect(() => {
		resizeObserver.current?.disconnect();
		measureRects();
		elements.forEach((element) => resizeObserver.current?.observe(element));
	});

	return {
		get current() {
			return rects;
		},
	};
}
