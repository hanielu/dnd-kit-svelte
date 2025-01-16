<script lang="ts" module>
	export interface Props {
		id: string;
		announcement: string;
		ariaLiveType?: 'polite' | 'assertive' | 'off';
	}
</script>

<script lang="ts">
	import {styleObjectToString} from '@dnd-kit-svelte/utilities';

	let {id, announcement, ariaLiveType = 'assertive'}: Props = $props();

	const visuallyHidden = styleObjectToString({
		position: 'fixed',
		top: 0,
		left: 0,
		width: 1,
		height: 1,
		margin: -1,
		border: 0,
		padding: 0,
		overflow: 'hidden',
		clip: 'rect(0 0 0 0)',
		clipPath: 'inset(100%)',
		whiteSpace: 'nowrap',
	});
</script>

<div {id} style={visuallyHidden} role="status" aria-live={ariaLiveType} aria-atomic="true">
	{announcement}
</div>
