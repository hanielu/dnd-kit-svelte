import {defaultPublicContext, PublicContextKey} from '$core/store/context.js';
import type {PublicContextDescriptor} from '$core/store/types.js';
import {getContext, hasContext} from 'svelte';

export function getDndContext() {
	if (!hasContext(PublicContextKey)) {
		return defaultPublicContext;
	}
	return getContext<{current: PublicContextDescriptor}>(PublicContextKey).current;
}

export type GetDndContextReturnValue = ReturnType<typeof getDndContext>;
