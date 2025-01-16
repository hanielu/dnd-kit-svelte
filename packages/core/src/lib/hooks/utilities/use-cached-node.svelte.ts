import type {DraggableNodes, DraggableNode} from '$core/store/types.js';
import type {UniqueIdentifier} from '$core/types/other.js';
import {useLazyMemo} from '@dnd-kit-svelte/utilities';

export function useCachedNode(args: () => [draggableNodes: DraggableNodes, id: UniqueIdentifier | null]) {
	const [draggableNodes, id] = $derived(args());
	const draggableNode = $derived(id != null ? draggableNodes.get(id) : undefined);
	const node = $derived(draggableNode ? draggableNode.node : null);

	return useLazyMemo<DraggableNode['node']>((cachedNode) => {
		if (id == null) {
			return null;
		}

		// In some cases, the draggable node can unmount while dragging
		// This is the case for virtualized lists. In those situations,
		// we fall back to the last known value for that node.
		return node ?? cachedNode ?? null;
	});
}
