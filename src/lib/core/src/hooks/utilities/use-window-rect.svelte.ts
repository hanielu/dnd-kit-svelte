import {getWindowClientRect} from '$core/utilities/rect/get-window-client-rect.js';

export function useWindowRect(elementFn: () => typeof window | null) {
	const element = $derived.by(elementFn);

	return {
		get current() {
			return element ? getWindowClientRect(element) : null;
		},
	};
}
