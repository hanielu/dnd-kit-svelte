import type {DndMonitorEvent, DndMonitorListener} from './types.js';

export function useDndMonitorProvider() {
	const listeners = new Set<DndMonitorListener>();

	const registerListener = (listener: DndMonitorListener) => {
		listeners.add(listener);
		return () => listeners.delete(listener);
	};

	const dispatch = ({type, event}: DndMonitorEvent) => {
		listeners.forEach((listener) => listener[type]?.(event as any));
	};

	return [dispatch, registerListener] as const;
}
