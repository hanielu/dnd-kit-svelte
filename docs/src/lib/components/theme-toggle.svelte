<script lang="ts">
	// The theme follows the system until it's picked here. app.html applies it before the first paint.
	function toggle() {
		const dark = document.documentElement.classList.toggle("dark");
		try {
			localStorage.setItem("theme", dark ? "dark" : "light");
		} catch {}
	}

	$effect(() => {
		const query = matchMedia("(prefers-color-scheme: dark)");
		const follow = () => {
			try {
				if (localStorage.getItem("theme")) return;
			} catch {}
			document.documentElement.classList.toggle("dark", query.matches);
		};
		query.addEventListener("change", follow);
		return () => query.removeEventListener("change", follow);
	});
</script>

<button
	type="button"
	onclick={toggle}
	aria-label="Switch between light and dark mode"
	class="s-9 flex-s-center rd-xl text-ink-soft hover:(bg-surface text-ink) transition-colors"
>
	<span class="i-lucide-moon dark:hidden"></span>
	<span class="i-lucide-sun hidden dark:block"></span>
</button>
