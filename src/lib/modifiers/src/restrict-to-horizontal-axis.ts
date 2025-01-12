import type {Modifier} from '$core/index.js';

export const restrictToHorizontalAxis: Modifier = ({transform}) => {
	return {
		...transform,
		y: 0,
	};
};
