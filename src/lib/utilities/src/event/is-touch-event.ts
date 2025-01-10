import {getWindow} from '../execution-context/index.js';

export function isTouchEvent(event: Event | undefined | null): event is TouchEvent {
	if (!event) {
		return false;
	}

	const {TouchEvent} = getWindow(event.target);

	return TouchEvent && event instanceof TouchEvent;
}
