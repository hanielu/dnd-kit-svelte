import {toFn, watch, type MaybeGetter} from 'runed';

export function useOnValueChange<T>(
	value: MaybeGetter<T>,
	onChange: (value: T, oldValue: T) => void,
	effect: typeof watch | typeof watch.pre = watch,
	compare = Object.is
) {
	effect(toFn<T>(value), (value, oldValue) => {
		if (!compare(value, oldValue)) {
			onChange(value, oldValue!);
		}
	});
}
