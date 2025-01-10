import type {FirstArgument, Transform} from '$utilities';

import type {Modifiers, Modifier} from './types.js';

export function applyModifiers(
	modifiers: Modifiers | undefined,
	{transform, ...args}: FirstArgument<Modifier>
): Transform {
	return modifiers?.length
		? modifiers.reduce<Transform>((accumulator, modifier) => {
				return modifier({
					transform: accumulator,
					...args,
				});
			}, transform)
		: transform;
}
