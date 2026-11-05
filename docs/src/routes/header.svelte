<script lang="ts">
	import { page } from "$app/state";
	import LogosSvelteIcon from "~icons/logos/svelte-icon";
	import ThemeToggle from "#lib/components/theme-toggle.svelte";

	const docs = $derived(page.url.pathname.startsWith("/docs"));
	const links = $derived([
		{ href: "/docs", label: "Docs", active: docs },
		{ href: "/", label: "Examples", active: page.url.pathname === "/" },
		{ href: "https://github.com/hanielu/dnd-kit-svelte", label: "GitHub", active: false },
	]);
</script>

<!-- On docs pages the header stays at the top, 4rem tall, and the sidebar sits right below it. -->
<header
	class={[
		"px-5",
		docs ? "sticky top-0 z-10 min-h-16 py-3 flex items-center bg-page/85 backdrop-blur-md b-b-(1 line)" : "pt-5",
	]}
>
	<nav class={["w-full mx-a flex-s-between gap-4 flex-wrap", docs ? "max-w-6xl" : "max-w-3xl"]}>
		<a href="/" class="flex-s-start gap-2 text-3xl">
			<LogosSvelteIcon />
			<span class="text-ink-soft fw-semibold">dnd kit</span>
		</a>
		<div class="flex-s-start gap-4 text-(sm ink-soft) fw-medium lg:text-base">
			{#each links as link (link.href)}
				<a
					href={link.href}
					aria-current={link.active ? "page" : undefined}
					class={["underline underline-offset-3 hover:text-ink", link.active && "text-ink decoration-orange"]}
				>
					{link.label}
				</a>
			{/each}
			<ThemeToggle />
		</div>
	</nav>
</header>
