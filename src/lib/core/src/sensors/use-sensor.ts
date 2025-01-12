import type {Sensor, SensorDescriptor, SensorOptions} from './types.js';

export function useSensor<T extends SensorOptions>(sensor: Sensor<T>, options?: T): SensorDescriptor<T> {
	return {
		sensor,
		options: options ?? ({} as T),
	};
}
