import {resolve, type MaybeGetter} from 'runed';

export function useOnElementChange(
	value: MaybeGetter<Element | undefined> | undefined,
	onChange: (value: Element | undefined) => void
) {
	let previous = resolve(value);

	$effect.pre(() => {
		const current = resolve(value);
		if (current !== previous) {
			previous = current;
			onChange(current);
		}
	});
}
