import type {ClientRect} from '../../types/index.js';
import {useInitialValue} from './use-initial-value.js';

export function useInitialRect(node: () => HTMLElement | null, measure: () => (node: HTMLElement) => ClientRect) {
	return useInitialValue(node, measure);
}
