<script lang="ts">
	import { useDraggable } from "@dnd-kit-svelte/svelte";

	const { ref } = useDraggable({ id: "card" });
</script>

<button {@attach ref} class="px-4 py-3 rd-xl fw-bold text-white bg-orange">Card</button>
