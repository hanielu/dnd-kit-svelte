<script lang="ts">
	import IconCheck from "~icons/lucide/check";
	import IconCopy from "~icons/lucide/copy";

	interface Props {
		/** Read when the button is pressed, so it can come from the DOM. */
		text: () => string;
	}

	let { text }: Props = $props();

	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(text());
		} catch {
			return; // Clipboard access can be denied; the code stays selectable
		}
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<button
	type="button"
	aria-label="Copy code"
	onclick={copy}
	class="absolute top-3 right-3 s-8 grid place-items-center rd-lg b-(1 line) bg-surface text-ink-faint hover:text-ink opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
>
	{#if copied}<IconCheck />{:else}<IconCopy />{/if}
</button>
