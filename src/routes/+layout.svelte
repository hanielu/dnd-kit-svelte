<script lang="ts">
	import '../app.css';
	import '@unocss/reset/tailwind.css';
	import 'uno.css';

	let { children } = $props();
</script>

{@render children()}
