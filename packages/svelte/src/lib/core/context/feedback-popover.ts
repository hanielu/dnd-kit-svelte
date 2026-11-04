import { Feedback, type DragDropManager } from "@dnd-kit/dom";
import { showPopover } from "@dnd-kit/dom/utilities";
import { effect } from "@dnd-kit/state";

/**
 * Keeps the dragged element in the top layer while Svelte reorders the list it is in.
 *
 * Feedback inserts its placeholder right after the dragged element, inside that item's range in a keyed `{#each}`,
 * so when Svelte moves the item to a higher index it moves both. Moving an element closes its popover without a
 * `beforetoggle` event, and dnd kit only reopens it when the element and its placeholder end up apart. This reopens
 * it after any DOM change during a drag; mutation observers run before the next paint, so no frame shows it closed.
 */
export function keepFeedbackOnTop(manager: DragDropManager): () => void {
	return effect(() => {
		if (!manager.dragOperation.status.dragging) return;

		const observer = new MutationObserver(() => {
			const feedback = manager.plugins.find((plugin) => plugin instanceof Feedback);
			const element = feedback?.overlay ?? manager.dragOperation.source?.element;
			if (element) showPopover(element);
		});
		observer.observe(document.body, { childList: true, subtree: true });
		return () => observer.disconnect();
	});
}
