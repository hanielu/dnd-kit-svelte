<script lang="ts">
	import { DragDropProvider } from "@dnd-kit-svelte/svelte";
	import { move } from "@dnd-kit/helpers";
	import Song from "./song.svelte";

	let songs = $state(["Morning light", "Paper boats", "Long way home", "City at night"]);
</script>

<DragDropProvider onDragOver={(event) => (songs = move(songs, event))}>
	<ol class="grid gap-2">
		{#each songs as song, index (song)}
			<Song title={song} {index} />
		{/each}
	</ol>
</DragDropProvider>
