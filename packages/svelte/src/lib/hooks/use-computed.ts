import {computed} from '@dnd-kit/state';
import {useSignal} from './use-signal.js';

export function useComputed<T = any>(compute: () => T) {
	return useSignal(computed(compute));
}
