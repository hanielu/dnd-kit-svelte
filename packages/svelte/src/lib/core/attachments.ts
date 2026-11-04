import type { DragDropManager } from "@dnd-kit/abstract";
import type { Attachment } from "svelte/attachments";

type ElementKey<T> = { [K in keyof T]: Element | undefined extends T[K] ? K : never }[keyof T];

/**
 * An attachment that sets `entity[key]` to the node and clears it on detach, unless another node took over. With
 * `keepWhileDragging`, a node that is still connected stays set during a drag, while the item moves between lists.
 */
export function attachTo<T extends { manager: DragDropManager<any, any> | undefined }>(
	entity: T,
	key: ElementKey<T>,
	keepWhileDragging = false
): Attachment<Element> {
	const slot = entity as unknown as Record<typeof key, Element | undefined>;
	return (node) => {
		slot[key] = node;
		return () => {
			if (slot[key] !== node) return;
			if (keepWhileDragging && node.isConnected && !entity.manager?.dragOperation.status.idle) return;
			slot[key] = undefined;
		};
	};
}
