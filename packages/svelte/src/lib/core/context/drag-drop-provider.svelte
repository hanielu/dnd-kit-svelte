<script lang="ts" module>
	import type {Data, DragDropEvents} from '@dnd-kit/abstract';
	import type {DragDropManagerInput, Draggable, Droppable} from '@dnd-kit/dom';
	import {DragDropContext} from './context.js';
	import {DragDropManager, defaultPreset} from '@dnd-kit/dom';
	import {deepEqual} from '@dnd-kit/state';
	import {lens} from 'runed';
	import {showPopover} from '@dnd-kit/dom/utilities';
	import {untrack, type Snippet} from 'svelte';
	import {useOnValueChange} from '$hooks';
	import {useRenderer} from './renderer.svelte.js';

	type PropsWithChildren<P = unknown> = P & {children?: Snippet | undefined};

	export type Events<
		T extends Data = Data,
		U extends Draggable<T> = Draggable<T>,
		V extends Droppable<T> = Droppable<T>,
		W extends DragDropManager<T, U, V> = DragDropManager<T, U, V>,
	> = DragDropEvents<U, V, W>;

	export interface Props<
		T extends Data = Data,
		U extends Draggable<T> = Draggable<T>,
		V extends Droppable<T> = Droppable<T>,
		W extends DragDropManager<T, U, V> = DragDropManager<T, U, V>,
	> extends DragDropManagerInput,
			PropsWithChildren {
		manager?: W;
		onBeforeDragStart?: Events<T, U, V, W>['beforedragstart'];
		onCollision?: Events<T, U, V, W>['collision'];
		onDragStart?: Events<T, U, V, W>['dragstart'];
		onDragMove?: Events<T, U, V, W>['dragmove'];
		onDragOver?: Events<T, U, V, W>['dragover'];
		onDragEnd?: Events<T, U, V, W>['dragend'];
	}
</script>

<script
	lang="ts"
	generics="T extends Data = Data,
  U extends Draggable<T> = Draggable<T>,
  V extends Droppable<T> = Droppable<T>,
  W extends DragDropManager<T, U, V> = DragDropManager<T, U, V>,"
>
	let {
		children,
		onCollision,
		onBeforeDragStart,
		onDragStart,
		onDragMove,
		onDragOver,
		onDragEnd,
		...input
	}: Props<T, U, V, W> = $props();

	let manager = $state<W | undefined>(input.manager);

	const {renderer, trackRendering} = useRenderer();

	function attachManager(mgr: W) {
		mgr.renderer = renderer;

		// This is needed because the way svelte orders items in keyed each blocks
		// causes the feedback to bug out and not show up when going from a lower
		// index to a higher index. This is a workaround to ensure the feedback
		// element stays in the top layer.
		function checkPopover() {
			// Ensure feedback element stays in the top layer if popover closed due to DOM reordering
			const el = mgr.dragOperation.source?.element;
			if (el) showPopover(el);
		}

		mgr.monitor.addEventListener('beforedragstart', (event) => {
			const cb = onBeforeDragStart;
			if (cb) trackRendering(() => cb(event, mgr));
		});
		mgr.monitor.addEventListener('dragstart', (event) => onDragStart?.(event, mgr));
		mgr.monitor.addEventListener('dragover', (event) => {
			const cb = onDragOver;
			if (cb) trackRendering(() => cb(event, mgr));
			checkPopover();
		});
		mgr.monitor.addEventListener('dragmove', (event) => {
			const cb = onDragMove;
			if (cb) trackRendering(() => cb(event, mgr));
			checkPopover();
		});
		mgr.monitor.addEventListener('dragend', (event) => {
			const cb = onDragEnd;
			if (cb) trackRendering(() => cb(event, mgr));
		});
		mgr.monitor.addEventListener('collision', (event) => onCollision?.(event, mgr));

		manager = mgr;

		return manager.destroy;
	}

	// on mount
	$effect(() => {
		return untrack(() => {
			const mgr = (input.manager ?? (new DragDropManager<T, U, V>(input) as W)) as W;
			return attachManager(mgr);
		});
	});

	const options = [undefined, deepEqual] as const;

	useOnValueChange(
		() => input.plugins,
		(plugins) => {
			if (manager) manager.plugins = plugins ?? defaultPreset.plugins;
		},
		...options
	);
	useOnValueChange(
		() => input.sensors,
		(sensors) => {
			if (manager) manager.sensors = sensors ?? defaultPreset.sensors;
		},
		...options
	);
	useOnValueChange(
		() => input.modifiers,
		(modifiers) => {
			if (manager) manager.modifiers = modifiers ?? defaultPreset.modifiers;
		},
		...options
	);

	DragDropContext.set(lens(() => manager as unknown as DragDropManager | null));
</script>

{@render children?.()}
