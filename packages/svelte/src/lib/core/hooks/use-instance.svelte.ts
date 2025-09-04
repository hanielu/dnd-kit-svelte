import type {DragDropManager} from '@dnd-kit/abstract';
import type {CleanupFunction} from '@dnd-kit/state';

import {useDragDropManager} from './use-drag-drop-manager.js';

export interface Instance<T extends DragDropManager<any, any> = DragDropManager<any, any>> {
	manager: T | undefined;
	register(): CleanupFunction | void;
}

export function useInstance<T extends Instance>(initializer: (manager: DragDropManager<any, any> | undefined) => T): T {
	const manager = useDragDropManager();
	const instance = initializer(manager.current ?? undefined);

	$effect.pre(() => {
		if (instance.manager !== manager.current) {
			instance.manager = manager.current ?? undefined;
		}

		return instance.register();
	});

	return instance;
}
