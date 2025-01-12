import type {Modifier} from '$core/index.js';

export const restrictToVerticalAxis: Modifier = ({transform}) => {
	return {
		...transform,
		x: 0,
	};
};
