<script lang="ts" module>
	import {DragDropManager} from '@dnd-kit/dom';

	import {DragDropContext} from './context.js';
	import {useRenderer} from '../hooks/use-renderer.svelte.js';

	import type {Data, DragDropEvents} from '@dnd-kit/abstract';
	import type {DragDropManagerInput, Draggable, Droppable} from '@dnd-kit/dom';
	import type {Snippet} from 'svelte';

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
		plugins,
		modifiers,
		sensors,

		children,
		onCollision,
		onBeforeDragStart,
		onDragStart,
		onDragMove,
		onDragOver,
		onDragEnd,
		...input
	}: Props<T, U, V, W> = $props();

	const {renderer, trackRendering} = useRenderer();
	const manager = input.manager ?? (new DragDropManager<T, U, V>(input) as W);
	manager.renderer = renderer;

	$effect(() => {
		if (plugins) {
			manager.plugins = plugins;
		}
		if (modifiers) {
			manager.modifiers = modifiers;
		}
		if (sensors) {
			manager.sensors = sensors;
		}
	});

	$effect(() => {
		manager.monitor.addEventListener('beforedragstart', (event) => {
			const callback = onBeforeDragStart;

			if (callback) {
				trackRendering(() => callback(event, manager));
			}
		});
		manager.monitor.addEventListener('dragstart', (event) => onDragStart?.(event, manager));
		manager.monitor.addEventListener('dragover', (event) => {
			const callback = onDragOver;

			if (callback) {
				trackRendering(() => callback(event, manager));
			}
		});
		manager.monitor.addEventListener('dragmove', (event) => {
			const callback = onDragMove;

			if (callback) {
				trackRendering(() => callback(event, manager));
			}
		});
		manager.monitor.addEventListener('dragend', (event) => {
			const callback = onDragEnd;

			if (callback) {
				trackRendering(() => callback(event, manager));
			}
		});
		manager.monitor.addEventListener('collision', (event) => onCollision?.(event, manager));

		return manager.destroy;
	});

	DragDropContext.set(manager as unknown as DragDropManager | null);
</script>

{@render children?.()}
