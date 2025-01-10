import {
	AbstractPointerSensor,
	type PointerSensorProps,
	type PointerEventHandlers,
	type PointerSensorOptions,
} from '../pointer/index.js';
import type {SensorProps} from '../types.js';

const events: PointerEventHandlers = {
	cancel: {name: 'touchcancel'},
	move: {name: 'touchmove'},
	end: {name: 'touchend'},
};

export interface TouchSensorOptions extends PointerSensorOptions {}

export type TouchSensorProps = SensorProps<TouchSensorOptions>;

export class TouchSensor extends AbstractPointerSensor {
	constructor(props: PointerSensorProps) {
		super(props, events);
	}

	static activators = [
		{
			eventName: 'ontouchstart' as const,
			handler: (event: TouchEvent, {onActivation}: TouchSensorOptions) => {
				const {touches} = event;

				if (touches.length > 1) {
					return false;
				}

				onActivation?.({event});

				return true;
			},
		},
	];

	static setup() {
		// Adding a non-capture and non-passive `touchmove` listener in order
		// to force `event.preventDefault()` calls to work in dynamically added
		// touchmove event handlers. This is required for iOS Safari.
		window.addEventListener(events.move.name, noop, {
			capture: false,
			passive: false,
		});

		return function teardown() {
			window.removeEventListener(events.move.name, noop);
		};

		// We create a new handler because the teardown function of another sensor
		// could remove our event listener if we use a referentially equal listener.
		function noop() {}
	}
}
