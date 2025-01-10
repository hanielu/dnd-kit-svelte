import type {SensorDescriptor, SensorActivatorFunction} from '$core/sensors/index.js';
import {box} from 'svelte-toolbelt';
import type {SyntheticListener, SyntheticListeners} from './use-synthetic-listeners.svelte.js';

export function useCombineActivators(
	args: () => [
		sensors: SensorDescriptor<any>[],
		getSyntheticHandler: (
			handler: SensorActivatorFunction<any>,
			sensor: SensorDescriptor<any>
		) => SyntheticListener['handler'],
	]
) {
	return box.with(() => {
		const [sensors, getSyntheticHandler] = args();

		return sensors.reduce<SyntheticListeners>((accumulator, sensor) => {
			const {sensor: Sensor} = sensor;

			const sensorActivators = Sensor.activators.map((activator) => ({
				eventName: activator.eventName,
				handler: getSyntheticHandler(activator.handler, sensor),
			}));

			return [...accumulator, ...sensorActivators];
		}, []);
	});
}
