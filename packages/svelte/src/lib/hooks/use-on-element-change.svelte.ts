import {toFn, type MaybeGetter} from 'runed';

export function useOnElementChange(
	value: MaybeGetter<Element> | undefined,
	onChange: (value: Element | undefined) => void
) {
	let previous = toFn(value)();

	$effect.pre(() => {
		const current = toFn(value)();
		if (current !== previous) {
			previous = current;
			onChange(current);
		}
	});
}
