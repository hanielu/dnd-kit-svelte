import {
	type DropAnimation,
	defaultDropAnimationSideEffects,
	useSensors,
	useSensor,
	TouchSensor,
	KeyboardSensor,
	MouseSensor,
} from 'svelte-dnd-kit';

export const dropAnimation: DropAnimation = {
	sideEffects: defaultDropAnimationSideEffects({
		styles: {
			active: {
				opacity: '0.5',
			},
		},
	}),
};

export const sensors = useSensors(useSensor(TouchSensor), useSensor(KeyboardSensor), useSensor(MouseSensor));
