<script lang="ts">
	import {getInternalContext} from '$core/store/context.js';
	import {isKeyboardEvent, findFirstFocusableNode} from '@dnd-kit-svelte/utilities';

	interface Props {
		disabled: boolean;
	}

	let {disabled}: Props = $props();

	const {active, activatorEvent, draggableNodes} = $derived(getInternalContext());

	let previousActivatorEvent = activatorEvent;
	let previousActiveId = active?.id;

	$effect(() => {
		if (disabled) {
			return;
		}

		if (!activatorEvent && previousActivatorEvent && previousActiveId != null) {
			if (!isKeyboardEvent(previousActivatorEvent)) {
				return;
			}

			if (document.activeElement === previousActivatorEvent.target) {
				// No need to restore focus
				return;
			}

			const draggableNode = draggableNodes.get(previousActiveId);

			if (!draggableNode) {
				return;
			}

			const {activatorNode, node} = draggableNode;

			if (!activatorNode && !node) {
				return;
			}

			requestAnimationFrame(() => {
				for (const element of [activatorNode, node]) {
					if (!element) {
						continue;
					}

					const focusableNode = findFirstFocusableNode(element);

					if (focusableNode) {
						focusableNode.focus();
						break;
					}
				}
			});
		}
	});

	$effect(() => {
		previousActivatorEvent = activatorEvent;
		previousActiveId = active?.id;
	});
</script>
