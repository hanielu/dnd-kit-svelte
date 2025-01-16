import {getOwnerDocument} from '@dnd-kit-svelte/utilities';

import type {SensorProps} from '../types.js';
import {
	AbstractPointerSensor,
	type AbstractPointerSensorOptions,
	type PointerEventHandlers,
} from './abstract-pointer-sensor.js';

const events: PointerEventHandlers = {
	cancel: {name: 'pointercancel'},
	move: {name: 'pointermove'},
	end: {name: 'pointerup'},
};

export interface PointerSensorOptions extends AbstractPointerSensorOptions {}

export type PointerSensorProps = SensorProps<PointerSensorOptions>;

export class PointerSensor extends AbstractPointerSensor {
	constructor(props: PointerSensorProps) {
		const {event} = props;
		// Pointer events stop firing if the target is unmounted while dragging
		// Therefore we attach listeners to the owner document instead
		const listenerTarget = getOwnerDocument(event.target);

		super(props, events, listenerTarget);
	}

	static activators = [
		{
			eventName: 'onpointerdown' as const,
			handler: (event: PointerEvent, {onActivation}: PointerSensorOptions) => {
				if (!event.isPrimary || event.button !== 0) {
					return false;
				}

				onActivation?.({event});

				return true;
			},
		},
	];
}
