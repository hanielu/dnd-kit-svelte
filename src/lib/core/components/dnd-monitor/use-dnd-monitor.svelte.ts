import {getDndMonitorContext} from './context.js';
import type {DndMonitorListener} from './types.js';

export function useDndMonitor(listener: DndMonitorListener) {
	const registerListener = getDndMonitorContext();

	$effect(() => {
		if (!registerListener) {
			throw new Error('useDndMonitor must be used within a children of <DndContext>');
		}

		const unsubscribe = registerListener(listener);

		return unsubscribe;
	});
}
