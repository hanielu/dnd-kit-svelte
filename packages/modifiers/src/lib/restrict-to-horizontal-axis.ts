import type {Modifier} from '@dnd-kit-svelte/core';

export const restrictToHorizontalAxis: Modifier = ({transform}) => {
	return {
		...transform,
		y: 0,
	};
};
