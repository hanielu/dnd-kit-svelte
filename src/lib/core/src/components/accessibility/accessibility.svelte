<script lang="ts">
	import {HiddenText, LiveRegion, Portal, useAnnouncement} from '$accessibility';
	import {useUniqueId} from '$utilities';
	import {useDndMonitor} from '../dnd-monitor/index.js';
	import {defaultAnnouncements, defaultScreenReaderInstructions} from './defaults.js';
	import type {Announcements, ScreenReaderInstructions} from './types.js';

	interface Props {
		announcements?: Announcements;
		container?: HTMLElement;
		screenReaderInstructions?: ScreenReaderInstructions;
		hiddenTextDescribedById: string;
	}

	let {
		announcements = defaultAnnouncements,
		container,
		hiddenTextDescribedById,
		screenReaderInstructions = defaultScreenReaderInstructions,
	}: Props = $props();

	const {announce, announcement} = useAnnouncement();
	const liveRegionId = useUniqueId(`DndLiveRegion`);
	let mounted = $state(false);

	$effect(() => {
		mounted = true;
	});

	useDndMonitor({
		onDragStart({active}) {
			announce(announcements.onDragStart({active}));
		},
		onDragMove({active, over}) {
			if (announcements.onDragMove) {
				announce(announcements.onDragMove({active, over}));
			}
		},
		onDragOver({active, over}) {
			announce(announcements.onDragOver({active, over}));
		},
		onDragEnd({active, over}) {
			announce(announcements.onDragEnd({active, over}));
		},
		onDragCancel({active, over}) {
			announce(announcements.onDragCancel({active, over}));
		},
	});
</script>

{#if mounted}
	{#if container}
		<Portal to={container}>
			{@render markup()}
		</Portal>
	{:else}
		{@render markup()}
	{/if}
{/if}

{#snippet markup()}
	<HiddenText id={hiddenTextDescribedById} value={screenReaderInstructions.draggable} />
	<LiveRegion id={liveRegionId} announcement={announcement.current} />
{/snippet}
