import type {SensorDescriptor, SensorOptions} from './types.js';

export function useSensors<T extends SensorOptions>(
	...sensors: (SensorDescriptor<T> | undefined | null)[]
): SensorDescriptor<T>[] {
	return sensors.filter((sensor): sensor is SensorDescriptor<T> => sensor != null);
}
