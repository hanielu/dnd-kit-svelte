<script lang="ts">
	import { useDraggable } from "@dnd-kit-svelte/svelte";
	import type { Modifiers } from "@dnd-kit/abstract";

	let { modifiers }: { modifiers: Modifiers } = $props();

	// A function, so the hook picks up the modifiers when the prop changes.
	const { ref } = useDraggable({ id: "box", modifiers: () => modifiers });
</script>

<button {@attach ref} class="s-20 rd-2xl bg-orange text-white fw-bold">Drag</button>
