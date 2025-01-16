import type {SensorDescriptor} from '$core/sensors/types.js';
import {canUseDOM} from '@dnd-kit-svelte/utilities';

export function useSensorSetup(sensorsFn: () => SensorDescriptor<any>[]) {
	$effect(() => {
		if (!canUseDOM) {
			return;
		}

		const sensors = sensorsFn();
		const teardownFns = sensors.map(({sensor}) => sensor.setup?.());

		return () => {
			for (const teardown of teardownFns) {
				teardown?.();
			}
		};
	});
}
