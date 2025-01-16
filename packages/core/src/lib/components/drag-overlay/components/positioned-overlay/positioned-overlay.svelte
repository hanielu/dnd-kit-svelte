<script lang="ts" module>
	import type {ClientRect, UniqueIdentifier} from '$core/types/index.js';
	import type {Snippet} from 'svelte';
	import {CSS, isKeyboardEvent, type Transform, styleObjectToString} from '@dnd-kit-svelte/utilities';
	import {getRelativeTransformOrigin} from '$core/utilities/index.js';

	type TransitionGetter = (activatorEvent: Event | null) => string | undefined;

	export interface Props {
		as: keyof HTMLElementTagNameMap;
		activatorEvent: Event | null;
		adjustScale?: boolean;
		children?: Snippet;
		className?: string;
		id: UniqueIdentifier; // TODO: remove
		rect: ClientRect | null;
		style?: Parameters<typeof styleObjectToString>[0];
		transition?: string | TransitionGetter;
		transform: Transform;
		handleExit: (node: HTMLElement) => void;
		ref: HTMLElement | null;

		onStylesUpdated: (styles: string) => void;
	}

	const baseStyles: Record<string, string> = {
		position: 'fixed',
		touchAction: 'none',
	};

	function defaultTransition(activatorEvent: Event | null): string | undefined {
		const isKeyboardActivator = isKeyboardEvent(activatorEvent);
		return isKeyboardActivator ? 'transform 250ms ease' : undefined;
	}
</script>

<script lang="ts">
	let {
		as,
		activatorEvent,
		adjustScale,
		children,
		className,
		rect,
		style,
		transform,
		transition = defaultTransition,
		handleExit,
		ref = $bindable(),
		onStylesUpdated,
	}: Props = $props();

	let scaleAdjustedTransform = $derived(
		adjustScale
			? transform
			: {
					...transform,
					scaleX: 1,
					scaleY: 1,
				}
	);

	let styles = $derived.by(() => {
		if (!rect) {
			return {};
		}

		return {
			...baseStyles,
			width: rect.width,
			height: rect.height,
			top: rect.top,
			left: rect.left,
			transform: CSS.Transform.toString(scaleAdjustedTransform),
			transformOrigin:
				adjustScale && activatorEvent
					? getRelativeTransformOrigin(activatorEvent as MouseEvent | KeyboardEvent | TouchEvent, rect)
					: undefined,
			transition: typeof transition === 'function' ? transition(activatorEvent) : transition,
			...style,
		};
	});

	const stylesString = $derived(styleObjectToString(styles));

	$effect(() => {
		onStylesUpdated(stylesString);
	});
</script>

{#if rect}
	<svelte:element this={as} bind:this={ref} class={className} style={stylesString} use:handleExit>
		{@render children?.()}
	</svelte:element>
{/if}
