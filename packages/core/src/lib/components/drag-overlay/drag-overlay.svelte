<script lang="ts" module>
	import type {DropAnimation} from '../index.js';
	import type {Modifiers} from '$core/modifiers/types.js';
	import {NullifiedContextProvider} from './components/nullified-context-provider/index.js';
	import {PositionedOverlay, type PositionedOverlayProps} from './components/positioned-overlay/index.js';
	import {getActiveDraggableContext} from '../dnd-context/dnd-context.svelte';
	import {useDndContext} from '$core/hooks/index.js';
	import {applyModifiers, type UniqueIdentifier} from '$core/index.js';
	import {useInitialValue} from '$core/hooks/utilities/index.js';
	import {useDropAnimation} from './hooks/index.js';

	export interface Props
		extends Pick<PositionedOverlayProps, 'adjustScale' | 'children' | 'className' | 'style' | 'transition'> {
		dropAnimation?: DropAnimation | null | undefined;
		modifiers?: Modifiers;
		wrapperElement?: keyof HTMLElementTagNameMap;
		zIndex?: number;
	}
</script>

<script lang="ts">
	let {
		adjustScale = false,
		children,
		dropAnimation: dropAnimationConfig,
		style,
		transition,
		modifiers,
		wrapperElement = 'div',
		className,
		zIndex = 999,
	}: Props = $props();

	const {
		activatorEvent,
		active,
		activeNodeRect,
		containerNodeRect,
		draggableNodes,
		droppableContainers,
		dragOverlay,
		over,
		measuringConfiguration,
		scrollableAncestors,
		scrollableAncestorRects,
		windowRect,
	} = $derived(useDndContext());

	const transform = $derived(getActiveDraggableContext());

	const modifiedTransform = $derived(
		applyModifiers(modifiers, {
			activatorEvent,
			active,
			activeNodeRect,
			containerNodeRect,
			draggingNodeRect: dragOverlay.rect,
			over,
			overlayNodeRect: dragOverlay.rect,
			scrollableAncestors,
			scrollableAncestorRects,
			transform,
			windowRect,
		})
	);
	const initialRect = useInitialValue(() => activeNodeRect);
	const dropAnimation = $derived(
		useDropAnimation({
			config: dropAnimationConfig,
			draggableNodes,
			droppableContainers,
			measuringConfiguration,
		})
	);

	let ghostElement: HTMLElement | undefined;
	let previousActiveId: UniqueIdentifier | undefined;
	// this is so that we can update the styles of the ghost element
	// to match the overlay element
	let onStylesUpdated = $state<(styles: string) => void>(() => {});

	function cleanup() {
		ghostElement?.remove();
		ghostElement = undefined;
		previousActiveId = undefined;
		onStylesUpdated = () => {};
	}

	function handleExit(overlayNode: HTMLElement) {
		$effect(() => {
			ghostElement = overlayNode.cloneNode(true) as HTMLElement;
			previousActiveId = active?.id;

			onStylesUpdated = (styles) => {
				ghostElement!.style.cssText = styles;
			};

			return () => {
				if (!ghostElement || !previousActiveId) return cleanup();
				document.body.appendChild(ghostElement);
				Promise.resolve(dropAnimation(previousActiveId, ghostElement)).then(cleanup);
			};
		});
	}
</script>

<NullifiedContextProvider>
	{#if active}
		{#key active.id}
			<PositionedOverlay
				id={active.id}
				bind:ref={() => null,
				(el) => {
					// We need to wait for the active node to be measured before connecting the drag overlay ref
					// otherwise collisions can be computed against a mispositioned drag overlay
					if (initialRect.current) {
						dragOverlay.setRef(el);
					}
				}}
				as={wrapperElement}
				{activatorEvent}
				{adjustScale}
				{className}
				{transition}
				rect={initialRect.current}
				style={{
					zIndex,
					...style,
				}}
				transform={modifiedTransform}
				{handleExit}
				{onStylesUpdated}
			>
				{@render children?.()}
			</PositionedOverlay>
		{/key}
	{/if}
</NullifiedContextProvider>
