<script lang="ts">
	let props: {
		href: string;
		class?: string;
	} = $props();
</script>

<a
	href={props.href}
	target="_blank"
	rel="noopener noreferrer"
	class={[
		'mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors inline-block',
		props.class,
	]}
>
	View on GitHub
</a>
