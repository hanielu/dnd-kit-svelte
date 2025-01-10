export {useSensor} from './use-sensor.js';

export {useSensors} from './use-sensors.js';

export {AbstractPointerSensor, PointerSensor} from './pointer/index.js';
export type {
	AbstractPointerSensorOptions,
	AbstractPointerSensorProps,
	PointerActivationConstraint,
	PointerEventHandlers,
	PointerSensorOptions,
	PointerSensorProps,
} from './pointer/index.js';

export {MouseSensor} from './mouse/index.js';
export type {MouseSensorOptions, MouseSensorProps} from './mouse/index.js';

export {TouchSensor} from './touch/index.js';
export type {TouchSensorOptions, TouchSensorProps} from './touch/index.js';

export {KeyboardSensor, KeyboardCode, defaultKeyboardCoordinateGetter} from './keyboard/index.js';
export type {
	KeyboardCoordinateGetter,
	KeyboardSensorOptions,
	KeyboardSensorProps,
	KeyboardCodes,
} from './keyboard/index.js';

export type {
	Activator,
	Activators,
	Response as SensorResponse,
	Sensor,
	Sensors,
	SensorActivatorFunction,
	SensorDescriptor,
	SensorContext,
	SensorHandler,
	SensorInstance,
	SensorOptions,
	SensorProps,
} from './types.js';
