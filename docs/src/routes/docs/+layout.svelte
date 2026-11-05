<script lang="ts">
	import { afterNavigate } from "$app/navigation";
	import { page } from "$app/state";
	import { nav, pages } from "#lib/docs/nav.js";
	import Footer from "../footer.svelte";

	let { children } = $props();

	// Derived, so the sidebar follows client-side navigation: the layout stays mounted between pages.
	const current = $derived(page.url.pathname.replace(/\/$/, ""));
	const index = $derived(pages.findIndex((link) => link.href === current));
	const previous = $derived(index > 0 ? pages[index - 1] : undefined);
	const next = $derived(index >= 0 ? pages[index + 1] : undefined);

	let menuOpen = $state(false);
	let sidebar: HTMLElement | undefined;

	afterNavigate(() => {
		menuOpen = false;
		// The sidebar scrolls on its own, so bring the current page's link into it when it's out of view.
		const link = sidebar?.querySelector<HTMLElement>(`a[href="${current}"]`);
		if (!sidebar || !link) return;
		const top = link.offsetTop;
		const bottom = top + link.offsetHeight;
		if (top < sidebar.scrollTop || bottom > sidebar.scrollTop + sidebar.clientHeight) {
			sidebar.scrollTop = top - sidebar.clientHeight / 2;
		}
	});
</script>

<div class="max-w-6xl mx-a px-5 lg:(grid grid-cols-[14rem_minmax(0,1fr)] gap-12)">
	<aside class="max-lg:hidden">
		<!-- Fixed below the 4rem header, at the aside's place in the grid, so it never moves with the page. It scrolls on
		     its own, and overscroll-contain keeps that scroll from passing on to the page at either end. -->
		<nav
			bind:this={sidebar}
			class="sidebar fixed top-16 bottom-0 w-56 overflow-y-auto overscroll-contain py-10 flex|col gap-8"
			aria-label="Docs"
		>
			{@render links()}
		</nav>
	</aside>

	<div class="min-w-0 max-w-[52rem] pt-10">
		<details class="lg:hidden mb-8 bg-surface rd-3xl" bind:open={menuOpen}>
			<summary class="px-5 py-4 text-(17px ink) fw-semibold cursor-pointer select-none">Menu</summary>
			<nav class="px-2 pb-5 flex|col gap-6" aria-label="Docs">{@render links()}</nav>
		</details>

		{@render children()}

		{#if previous || next}
			<nav class="mt-20 grid gap-3 sm:grid-cols-2" aria-label="Previous and next page">
				{#if previous}
					<a href={previous.href} class="bg-surface rd-3xl p-6 hover:b-orange b-(2 transparent) transition-colors">
						<span class="text-(15px ink-faint) fw-medium">Previous</span>
						<span class="block mt-2 text-(18px ink) fw-bold">{previous.title}</span>
					</a>
				{:else}
					<span></span>
				{/if}
				{#if next}
					<a
						href={next.href}
						class="bg-surface rd-3xl p-6 text-right hover:b-orange b-(2 transparent) transition-colors"
					>
						<span class="text-(15px ink-faint) fw-medium">Next</span>
						<span class="block mt-2 text-(18px ink) fw-bold">{next.title}</span>
					</a>
				{/if}
			</nav>
		{/if}

		<div class="mt-20">
			<Footer />
		</div>
	</div>
</div>

{#snippet links()}
	{#each nav as section (section.title)}
		<div>
			<p class="text-(15px ink) fw-bold mb-2 px-3">{section.title}</p>
			<ul class="flex|col gap-0.5">
				{#each section.pages as link (link.href)}
					<li>
						<a
							href={link.href}
							aria-current={link.href === current ? "page" : undefined}
							class={[
								"block px-3 py-2 rd-xl text-15px fw-medium transition-colors",
								link.href === current ? "bg-brand/10 text-brand fw-semibold" : "text-ink-soft hover:text-ink",
							]}
						>
							{link.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
{/snippet}

<style>
	.sidebar {
		scrollbar-width: thin;
		scrollbar-color: rgb(var(--line)) transparent;
	}
</style>
