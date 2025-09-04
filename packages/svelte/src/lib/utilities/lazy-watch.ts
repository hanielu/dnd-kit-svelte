import {watch, type Getter} from 'runed';

export function lazyWatch<T>(sources: Getter<T>, effect: (value: T, previousValue: T | undefined) => void) {
	watch(sources, effect, {lazy: true});
}
