import {defaultPublicContext, PublicContextKey} from '$core/store/context.js';
import type {PublicContextDescriptor} from '$core/store/types.js';
import {getContext, hasContext} from 'svelte';

export function useDndContext() {
	if (!hasContext(PublicContextKey)) return defaultPublicContext;
	return getContext<() => PublicContextDescriptor>(PublicContextKey)();
}

export type UseDndContextReturnValue = ReturnType<typeof useDndContext>;
