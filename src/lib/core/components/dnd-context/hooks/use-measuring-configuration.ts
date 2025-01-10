import type {DeepRequired} from '$utilities';
import {defaultMeasuringConfiguration} from '../defaults.js';
import type {MeasuringConfiguration} from '../types.js';

export function useMeasuringConfiguration(
	config: MeasuringConfiguration | undefined
): DeepRequired<MeasuringConfiguration> {
	return {
		draggable: {
			...defaultMeasuringConfiguration.draggable,
			...config?.draggable,
		},
		droppable: {
			...defaultMeasuringConfiguration.droppable,
			...config?.droppable,
		},
		dragOverlay: {
			...defaultMeasuringConfiguration.dragOverlay,
			...config?.dragOverlay,
		},
	};
}
