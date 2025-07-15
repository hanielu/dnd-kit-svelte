import {
	defaultCoordinates,
	getScrollableElement,
	getScrollCoordinates,
	getScrollOffsets,
} from '$core/utilities/index.js';
import {add, type Coordinates} from '@dnd-kit-svelte/utilities';

type ScrollCoordinates = Map<HTMLElement | Window, Coordinates>;

export function useScrollOffsets(elementsFn: () => Element[]) {
	const elements = $derived(elementsFn() ?? []);
	let scrollCoordinates = $state.raw<ScrollCoordinates | null>(null);
	let prevElements = elements;

	// To-do: Throttle the handleScroll callback
	const handleScroll = (event: Event) => {
		const scrollingElement = getScrollableElement(event.target);

		if (!scrollingElement) {
			return;
		}

		if (!scrollCoordinates) {
			scrollCoordinates = null;
			return;
		}

		scrollCoordinates.set(scrollingElement, getScrollCoordinates(scrollingElement));
		scrollCoordinates = new Map(scrollCoordinates);
	};

	$effect(() => {
		const previousElements = prevElements;

		if (elements !== previousElements) {
			cleanup(previousElements);

			const entries = elements
				.map((element) => {
					const scrollableElement = getScrollableElement(element);

					if (scrollableElement) {
						scrollableElement.addEventListener('scroll', handleScroll, {
							passive: true,
						});

						return [scrollableElement, getScrollCoordinates(scrollableElement)] as const;
					}

					return null;
				})
				.filter((entry): entry is [HTMLElement | (Window & typeof globalThis), Coordinates] => entry != null);

			scrollCoordinates = entries.length ? new Map(entries) : null;

			prevElements = elements;
		}

		function cleanup(elements: Element[]) {
			elements?.forEach((element) => {
				const scrollableElement = getScrollableElement(element);

				scrollableElement?.removeEventListener('scroll', handleScroll);
			});
		}

		return () => {
			cleanup(elements);
			cleanup(previousElements);
		};
	});

	const scrollOffsets = $derived.by<Coordinates>(() => {
		if (elements.length) {
			return scrollCoordinates
				? Array.from(scrollCoordinates.values()).reduce((acc, coordinates) => add(acc, coordinates), defaultCoordinates)
				: getScrollOffsets(elements);
		}

		return defaultCoordinates;
	});

	return {
		get current() {
			return scrollOffsets;
		},
	};
}
