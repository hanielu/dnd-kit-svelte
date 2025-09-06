import {asGetter, watch, type MaybeGetter} from 'runed';

export function useOnValueChange<T>(
	value: MaybeGetter<T> | undefined,
	onChange: (value: T, oldValue: T) => void,
	effect: typeof watch | typeof watch.pre = watch,
	compare = Object.is
) {
	effect(asGetter<T>(value), (value, oldValue) => {
		if (!compare(value, oldValue)) {
			onChange(value, oldValue!);
		}
	});
}
