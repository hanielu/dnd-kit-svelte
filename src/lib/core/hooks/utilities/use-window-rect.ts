import {getWindowClientRect} from '$core/utilities/rect/getWindowClientRect.js';

export function useWindowRect(elementFn: () => typeof window | null) {
	const element = $derived.by(elementFn);

	return {
		get current() {
			return element ? getWindowClientRect(element) : null;
		},
	};
}
