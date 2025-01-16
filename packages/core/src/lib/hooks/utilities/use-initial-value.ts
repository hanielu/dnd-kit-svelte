import {useLazyMemo} from '@dnd-kit-svelte/utilities';

type AnyFunction = () => (...args: any) => any;

export function useInitialValue<T, U extends AnyFunction | undefined = undefined>(
	value: () => T | null,
	computeFn?: U
) {
	return useLazyMemo<U extends AnyFunction ? ReturnType<ReturnType<U>> | null : T | null>((previousValue) => {
		const _value = value();
		const _computeFn = computeFn?.();

		if (!_value) {
			return null;
		}

		if (previousValue) {
			return previousValue;
		}

		return typeof _computeFn === 'function' ? _computeFn(_value) : _value;
	});
}
