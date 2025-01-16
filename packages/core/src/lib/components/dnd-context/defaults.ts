import type {DeepRequired} from '@dnd-kit-svelte/utilities';

import type {DataRef} from '../../store/types.js';
import {KeyboardSensor, PointerSensor} from '../../sensors/index.js';
import {MeasuringStrategy, MeasuringFrequency} from '../../hooks/utilities/index.js';
import {getClientRect, getTransformAgnosticClientRect} from '../../utilities/rect/index.js';

import type {MeasuringConfiguration} from './types.js';

export const defaultSensors = [
	{sensor: PointerSensor, options: {}},
	{sensor: KeyboardSensor, options: {}},
];

export const defaultData: DataRef = {current: {}};

export const defaultMeasuringConfiguration: DeepRequired<MeasuringConfiguration> = {
	draggable: {
		measure: getTransformAgnosticClientRect,
	},
	droppable: {
		measure: getTransformAgnosticClientRect,
		strategy: MeasuringStrategy.WhileDragging,
		frequency: MeasuringFrequency.Optimized,
	},
	dragOverlay: {
		measure: getClientRect,
	},
};
