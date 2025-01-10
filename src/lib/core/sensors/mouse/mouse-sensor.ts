import {getOwnerDocument} from '$utilities';

import type {SensorProps} from '../types.js';
import {AbstractPointerSensor, type PointerEventHandlers, type AbstractPointerSensorOptions} from '../pointer/index.js';

const events: PointerEventHandlers = {
	move: {name: 'mousemove'},
	end: {name: 'mouseup'},
};

enum MouseButton {
	RightClick = 2,
}

export interface MouseSensorOptions extends AbstractPointerSensorOptions {}

export type MouseSensorProps = SensorProps<MouseSensorOptions>;

export class MouseSensor extends AbstractPointerSensor {
	constructor(props: MouseSensorProps) {
		super(props, events, getOwnerDocument(props.event.target));
	}

	static activators = [
		{
			eventName: 'onmousedown' as const,
			handler: (event: MouseEvent, {onActivation}: MouseSensorOptions) => {
				if (event.button === MouseButton.RightClick) {
					return false;
				}

				onActivation?.({event});

				return true;
			},
		},
	];
}
