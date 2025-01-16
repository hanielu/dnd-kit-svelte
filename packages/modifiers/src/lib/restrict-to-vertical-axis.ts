import type {Modifier} from '@dnd-kit-svelte/core';

export const restrictToVerticalAxis: Modifier = ({transform}) => {
	return {
		...transform,
		x: 0,
	};
};
