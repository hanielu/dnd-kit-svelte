<script lang="ts">
	interface Props {
		id: string;
		value: string;
	}

	let {id, value}: Props = $props();

	const hiddenStyles = 'display: none;';
</script>

<div {id} style="display: none;">
	{value}
</div>
