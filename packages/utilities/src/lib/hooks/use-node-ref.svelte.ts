import {box} from 'svelte-toolbelt';

export function useNodeRef(onChange?: (newElement: HTMLElement | null, previousElement: HTMLElement | null) => void) {
	let node = $state<HTMLElement | null>(null);
	const setNodeRef = (element: HTMLElement | null) => {
		if (element !== node) {
			onChange?.(element, node);
		}

		node = element;
	};

	return [box.with(() => node, setNodeRef), setNodeRef] as const;
}
