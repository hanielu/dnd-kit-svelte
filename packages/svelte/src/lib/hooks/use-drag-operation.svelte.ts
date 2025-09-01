import {useDragDropManager} from '../context/use-drag-drop-manager.js';
import {wrapStore, type ProxiedStore} from '../utilities/preact-signals.svelte.js';

import type {DragDropManager} from '@dnd-kit/dom';

export interface UseDragOperationOptions {
	manager?: DragDropManager;
}

export function useDragOperation(
	options: UseDragOperationOptions = {}
): ProxiedStore<DragDropManager['dragOperation']> {
	const manager = options.manager ?? useDragDropManager();

	if (!manager) {
		throw new Error(
			'useDragOperation must be used within a DragDropProvider or provided with a manager. ' +
				'Make sure your app is wrapped in a DragDropProvider component or pass a manager prop.'
		);
	}

	let store: ProxiedStore<DragDropManager['dragOperation']>;

	$effect.pre(() => {
		store = wrapStore(manager.dragOperation);

		return () => store.dispose();
	});

	return store!;
}
