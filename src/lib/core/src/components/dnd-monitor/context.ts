import {getContext, hasContext} from 'svelte';
import type {RegisterListener} from './types.js';

export const DndMonitorContextKey = Symbol('DndMonitorContext');

export function getDndMonitorContext() {
	if (!hasContext(DndMonitorContextKey)) {
		return null;
	}
	return getContext<RegisterListener>(DndMonitorContextKey);
}
