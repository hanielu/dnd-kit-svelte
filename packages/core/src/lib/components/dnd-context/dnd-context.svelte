<script lang="ts" module>
	import type {SensorActivatorFunction, SensorContext, SensorDescriptor, SensorInstance} from '$core/sensors/types.js';
	import type {UniqueIdentifier} from '$core/types/other.js';
	import {getContext, setContext, type Snippet} from 'svelte';
	import {
		Action,
		type Over,
		useReducer,
		type Active,
		type PublicContextDescriptor,
		type InternalContextDescriptor,
		InternalContextKey,
		PublicContextKey,
	} from '$core/store/index.js';
	import {DndMonitorContextKey, useDndMonitorProvider} from '../dnd-monitor/index.js';
	import {defaultData, defaultSensors} from './defaults.js';
	import type {
		DragAbortEvent,
		DragPendingEvent,
		DragStartEvent,
		DragMoveEvent,
		DragOverEvent,
		DragEndEvent,
		DragCancelEvent,
	} from '$core/types/index.js';
	import {
		adjustScale,
		getAdjustedRect,
		getFirstCollision,
		rectIntersection,
		type CollisionDetection,
	} from '$core/utilities/index.js';
	import type {MeasuringConfiguration} from './types.js';
	import {applyModifiers, type Modifiers} from '$core/modifiers/index.js';
	import {add, getEventCoordinates, getWindow, useUniqueId, type Transform} from '@dnd-kit-svelte/utilities';
	import {useLayoutShiftScrollCompensation, useMeasuringConfiguration} from './hooks/index.js';
	import {
		useAutoScroller,
		useCachedNode,
		useCombineActivators,
		useDragOverlayMeasuring,
		useDroppableMeasuring,
		useInitialRect,
		useRect,
		useRectDelta,
		useRects,
		useScrollableAncestors,
		useScrollOffsets,
		useScrollOffsetsDelta,
		useSensorSetup,
		useWindowRect,
		type SyntheticListener,
	} from '$core/hooks/utilities/index.js';
	import type {AutoScrollOptions} from '$core/hooks/index.js';
	import type {Sensor} from '$core/sensors/index.js';
	import {watch} from 'runed';
	import type {Announcements, ScreenReaderInstructions} from '../accessibility/types.js';
	import {Accessibility, RestoreFocus} from '../accessibility/index.js';

	export interface Props {
		id?: string;
		accessibility?: {
			announcements?: Announcements;
			container?: HTMLElement;
			restoreFocus?: boolean;
			screenReaderInstructions?: ScreenReaderInstructions;
		};
		autoScroll?: boolean | AutoScrollOptions;
		cancelDrop?: CancelDrop;
		children?: Snippet;
		collisionDetection?: CollisionDetection;
		measuring?: MeasuringConfiguration;
		modifiers?: Modifiers;
		sensors?: SensorDescriptor<any>[];
		onDragAbort?(event: DragAbortEvent): void;
		onDragPending?(event: DragPendingEvent): void;
		onDragStart?(event: DragStartEvent): void;
		onDragMove?(event: DragMoveEvent): void;
		onDragOver?(event: DragOverEvent): void;
		onDragEnd?(event: DragEndEvent): void;
		onDragCancel?(event: DragCancelEvent): void;
	}

	export interface CancelDropArguments extends DragEndEvent {}

	export type CancelDrop = (args: CancelDropArguments) => boolean | Promise<boolean>;

	interface DndEvent extends Event {
		dndKit?: {
			capturedBy: Sensor<any>;
		};
	}

	export const ActiveDraggableContextKey = Symbol('ActiveDraggableContext');
	export function getActiveDraggableContext() {
		return getContext<() => Transform>(ActiveDraggableContextKey)();
	}

	enum Status {
		Uninitialized,
		Initializing,
		Initialized,
	}
</script>

<script lang="ts">
	let {
		id,
		accessibility,
		autoScroll = true,
		children,
		sensors = defaultSensors,
		collisionDetection = rectIntersection,
		measuring,
		modifiers,
		...latestProps
	}: Props = $props();

	const [ctxState, dispatch] = useReducer();
	const [dispatchMonitorEvent, registerMonitorListener] = useDndMonitorProvider();

	let status = $state<Status>(Status.Uninitialized);
	const isInitialized = $derived(status === Status.Initialized);
	const {
		draggable: {active: activeId, nodes: draggableNodes, translate},
		droppable: {containers: droppableContainers},
	} = $derived(ctxState);
	const node = $derived(activeId != null ? draggableNodes.get(activeId) : null);
	const activeRects: Active['rect'] = $state({
		initial: null,
		translated: null,
	});
	const active = $derived<Active | null>(
		activeId != null
			? {
					id: activeId,
					// It's possible for the active node to unmount while dragging
					data: node?.data ?? defaultData,
					rect: activeRects,
				}
			: null
	);
	let activeRef: UniqueIdentifier | null = null;
	let activeSensor = $state<SensorInstance | null>(null);
	let activatorEvent = $state<Event | null>(null);
	const draggableDescribedById = $derived(useUniqueId(`DndDescribedBy`, id));
	const enabledDroppableContainers = $derived(droppableContainers.getEnabled());
	const measuringConfiguration = $derived(useMeasuringConfiguration(measuring));
	const {droppableRects, measureDroppableContainers, measuringScheduled} = useDroppableMeasuring(() => ({
		containers: enabledDroppableContainers,
		dragging: isInitialized,
		dependencies: () => [translate.x, translate.y],
		config: measuringConfiguration.droppable,
	}));
	const activeNode = useCachedNode(() => [draggableNodes, activeId]);
	const activationCoordinates = $derived(activatorEvent ? getEventCoordinates(activatorEvent) : null);
	const autoScrollOptions = $derived(getAutoScrollerOptions());
	const initialActiveNodeRect = useInitialRect(
		() => activeNode.current,
		() => measuringConfiguration.draggable.measure
	);

	useLayoutShiftScrollCompensation(() => ({
		activeNode: activeId != null ? draggableNodes.get(activeId) : null,
		config: autoScrollOptions.layoutShiftCompensation,
		initialRect: initialActiveNodeRect.current,
		measure: measuringConfiguration.draggable.measure,
	}));

	const activeNodeRect = useRect(() => [
		activeNode.current,
		measuringConfiguration.draggable.measure,
		initialActiveNodeRect.current,
	]);
	const containerNodeRect = useRect(() => [activeNode.current ? activeNode.current.parentElement : null]);

	const sensorContext: SensorContext = $state({
		activatorEvent: null,
		active: null,
		activeNode: activeNode.current,
		collisionRect: null,
		collisions: null,
		droppableRects: droppableRects.current,
		// svelte-ignore state_referenced_locally
		draggableNodes,
		draggingNode: null,
		draggingNodeRect: null,
		// svelte-ignore state_referenced_locally
		droppableContainers,
		over: null,
		scrollableAncestors: [],
		scrollAdjustedTranslate: null,
	});
	const overNode = $derived(droppableContainers.getNodeFor(sensorContext.over?.id));
	const dragOverlay = useDragOverlayMeasuring({
		measureFn: () => measuringConfiguration.dragOverlay.measure,
	});

	// Use the rect of the drag overlay if it is mounted
	const draggingNode = $derived(dragOverlay.nodeRef ? dragOverlay.nodeRef : activeNode.current);
	const draggingNodeRect = $derived(isInitialized ? (dragOverlay.rect ?? activeNodeRect.current) : null);
	const usesDragOverlay = $derived(Boolean(dragOverlay.nodeRef && dragOverlay.rect));
	// The delta between the previous and new position of the draggable node
	// is only relevant when there is no drag overlay
	const nodeRectDelta = useRectDelta(() => (usesDragOverlay ? null : activeNodeRect.current));

	// Get the window rect of the dragging node
	const windowRect = useWindowRect(() => (draggingNode ? getWindow(draggingNode) : null));

	// Get scrollable ancestors of the dragging node
	const scrollableAncestors = useScrollableAncestors(() => (isInitialized ? (overNode ?? activeNode.current) : null));
	const scrollableAncestorRects = useRects(() => [scrollableAncestors.current]);

	// Apply modifiers
	const modifiedTranslate = $derived(
		applyModifiers(modifiers, {
			transform: {
				x: translate.x - nodeRectDelta.current.x,
				y: translate.y - nodeRectDelta.current.y,
				scaleX: 1,
				scaleY: 1,
			},
			activatorEvent,
			active,
			activeNodeRect: activeNodeRect.current,
			containerNodeRect: containerNodeRect.current,
			draggingNodeRect: draggingNodeRect,
			over: sensorContext.over,
			overlayNodeRect: dragOverlay.rect,
			scrollableAncestors: scrollableAncestors.current,
			scrollableAncestorRects: scrollableAncestorRects.current,
			windowRect: windowRect.current,
		})
	);

	const pointerCoordinates = $derived(activationCoordinates ? add(activationCoordinates, translate) : null);

	const scrollOffsets = useScrollOffsets(() => scrollableAncestors.current);
	// Represents the scroll delta since dragging was initiated
	const scrollAdjustment = useScrollOffsetsDelta(() => [scrollOffsets.current]);
	// Represents the scroll delta since the last time the active node rect was measured
	const activeNodeScrollDelta = useScrollOffsetsDelta(() => [scrollOffsets.current, [activeNodeRect.current]]);

	const scrollAdjustedTranslate = $derived(add(modifiedTranslate, scrollAdjustment.current));

	const collisionRect = $derived(draggingNodeRect ? getAdjustedRect(draggingNodeRect, modifiedTranslate) : null);

	const collisions = $derived(
		active && collisionRect
			? collisionDetection({
					active,
					collisionRect,
					droppableRects: droppableRects.current,
					droppableContainers: enabledDroppableContainers,
					pointerCoordinates,
				})
			: null
	);
	const overId = $derived(getFirstCollision(collisions, 'id'));
	let over = $state<Over | null>(null);

	// When there is no drag overlay used, we need to account for the
	// window scroll delta
	const appliedTranslate = $derived(
		usesDragOverlay ? modifiedTranslate : add(modifiedTranslate, activeNodeScrollDelta.current)
	);

	const transform = $derived(adjustScale(appliedTranslate, over?.rect ?? null, activeNodeRect.current));

	let activeSensorRef: SensorInstance | null = null;

	const instantiateSensor = (event: Event, {sensor: Sensor, options}: SensorDescriptor<any>) => {
		if (activeRef == null) {
			return;
		}

		const activeNode = draggableNodes.get(activeRef);

		if (!activeNode) {
			return;
		}

		const localActivatorEvent = event;

		const sensorInstance = new Sensor({
			active: activeRef,
			activeNode,
			event: localActivatorEvent,
			options,
			// Sensors need to be instantiated with $state as a Proxy for arguments that change over time
			// otherwise they are frozen in time with the stale arguments
			context: sensorContext,
			onAbort(id) {
				const draggableNode = draggableNodes.get(id);

				if (!draggableNode) {
					return;
				}

				const {onDragAbort} = latestProps;
				const event: DragAbortEvent = {id};
				onDragAbort?.(event);
				dispatchMonitorEvent({type: 'onDragAbort', event});
			},
			onPending(id, constraint, initialCoordinates, offset) {
				const draggableNode = draggableNodes.get(id);

				if (!draggableNode) {
					return;
				}

				const {onDragPending} = latestProps;
				const event: DragPendingEvent = {
					id,
					constraint,
					initialCoordinates,
					offset,
				};

				onDragPending?.(event);
				dispatchMonitorEvent({type: 'onDragPending', event});
			},
			onStart(initialCoordinates) {
				const id = activeRef;

				if (id == null) {
					return;
				}

				const draggableNode = draggableNodes.get(id);

				if (!draggableNode) {
					return;
				}

				const {onDragStart} = latestProps;
				const event: DragStartEvent = {
					activatorEvent: localActivatorEvent,
					active: {id, data: draggableNode.data, rect: activeRects},
				};

				onDragStart?.(event);
				status = Status.Initializing;
				dispatch({
					type: Action.DragStart,
					initialCoordinates,
					active: id,
				});
				dispatchMonitorEvent({type: 'onDragStart', event});
				activeSensor = activeSensorRef;
				activatorEvent = localActivatorEvent;
			},
			onMove(coordinates) {
				dispatch({
					type: Action.DragMove,
					coordinates,
				});
			},
			onEnd: createHandler(Action.DragEnd),
			onCancel: createHandler(Action.DragCancel),
		});

		activeSensorRef = sensorInstance;

		function createHandler(type: Action.DragEnd | Action.DragCancel) {
			return async function handler() {
				const {active, collisions, over: localOver, scrollAdjustedTranslate} = sensorContext;
				let event: DragEndEvent | null = null;

				if (active && scrollAdjustedTranslate) {
					const {cancelDrop} = latestProps;

					event = {
						activatorEvent: localActivatorEvent,
						active: active,
						collisions,
						delta: scrollAdjustedTranslate,
						over: localOver,
					};

					if (type === Action.DragEnd && typeof cancelDrop === 'function') {
						const shouldCancel = await Promise.resolve(cancelDrop(event));

						if (shouldCancel) {
							type = Action.DragCancel;
						}
					}
				}

				activeRef = null;

				dispatch({type});
				status = Status.Uninitialized;
				over = null;
				activeSensor = null;
				activatorEvent = null;
				activeSensorRef = null;

				const eventName = type === Action.DragEnd ? 'onDragEnd' : 'onDragCancel';

				if (event) {
					const handler = latestProps[eventName];

					handler?.(event);
					dispatchMonitorEvent({type: eventName, event});
				}
			};
		}
	};

	const bindActivatorToSensorInstantiator = (
		handler: SensorActivatorFunction<any>,
		sensor: SensorDescriptor<any>
	): SyntheticListener['handler'] => {
		return (event, active) => {
			const nativeEvent = event as DndEvent;
			const activeDraggableNode = draggableNodes.get(active);

			if (
				// Another sensor is already instantiating
				activeRef !== null ||
				// No active draggable
				!activeDraggableNode ||
				// Event has already been captured
				nativeEvent.dndKit ||
				nativeEvent.defaultPrevented
			) {
				return;
			}

			const activationContext = {
				active: activeDraggableNode,
			};
			const shouldActivate = handler(event, sensor.options, activationContext);

			if (shouldActivate === true) {
				nativeEvent.dndKit = {
					capturedBy: sensor.sensor,
				};

				activeRef = active;
				instantiateSensor(event, sensor);
			}
		};
	};

	const activators = useCombineActivators(() => [sensors, bindActivatorToSensorInstantiator]);

	useSensorSetup(() => sensors);

	$effect(() => {
		if (activeNodeRect.current && status === Status.Initializing) {
			status = Status.Initialized;
		}
	});

	watch(
		() => scrollAdjustedTranslate,
		() => {
			const {onDragMove} = latestProps;
			const {active, activatorEvent, collisions, over} = sensorContext;

			if (!active || !activatorEvent) {
				return;
			}

			const event: DragMoveEvent = {
				active,
				activatorEvent,
				collisions,
				delta: {
					x: scrollAdjustedTranslate.x,
					y: scrollAdjustedTranslate.y,
				},
				over,
			};

			onDragMove?.(event);
			dispatchMonitorEvent({type: 'onDragMove', event});
		}
	);

	watch(
		() => overId,
		() => {
			const {active, activatorEvent, collisions, droppableContainers, scrollAdjustedTranslate} = sensorContext;

			if (!active || activeRef == null || !activatorEvent || !scrollAdjustedTranslate) {
				return;
			}

			const {onDragOver} = latestProps;
			const overContainer = droppableContainers.get(overId);
			const localOver =
				overContainer && overContainer.rect
					? {
							id: overContainer.id,
							rect: overContainer.rect,
							data: overContainer.data,
							disabled: overContainer.disabled,
						}
					: null;
			const event: DragOverEvent = {
				active,
				activatorEvent,
				collisions,
				delta: {
					x: scrollAdjustedTranslate.x,
					y: scrollAdjustedTranslate.y,
				},
				over: localOver,
			};

			over = localOver;
			onDragOver?.(event);
			dispatchMonitorEvent({type: 'onDragOver', event});
		}
	);

	$effect(() => {
		Object.assign(sensorContext, {
			activatorEvent: activatorEvent,
			active: active,
			activeNode: activeNode.current,
			collisionRect: collisionRect,
			collisions: collisions,
			droppableRects: droppableRects.current,
			draggableNodes: draggableNodes,
			draggingNode: draggingNode,
			draggingNodeRect: draggingNodeRect,
			droppableContainers: droppableContainers,
			over: over,
			scrollableAncestors: scrollableAncestors.current,
			scrollAdjustedTranslate: scrollAdjustedTranslate,
		});

		Object.assign(activeRects, {
			initial: draggingNodeRect,
			translated: collisionRect,
		});
	});

	useAutoScroller(() => ({
		...autoScrollOptions,
		delta: translate,
		draggingRect: collisionRect,
		pointerCoordinates,
		scrollableAncestors: scrollableAncestors.current,
		scrollableAncestorRects: scrollableAncestorRects.current,
	}));

	const publicContext = $derived<PublicContextDescriptor>({
		active,
		activeNode: activeNode.current,
		activeNodeRect: activeNodeRect.current,
		activatorEvent,
		collisions,
		containerNodeRect: containerNodeRect.current,
		dragOverlay,
		draggableNodes,
		droppableContainers,
		droppableRects: droppableRects.current,
		over,
		measureDroppableContainers,
		scrollableAncestors: scrollableAncestors.current,
		scrollableAncestorRects: scrollableAncestorRects.current,
		measuringConfiguration,
		measuringScheduled: measuringScheduled.current,
		windowRect: windowRect.current,
	});

	const internalContext = $derived<InternalContextDescriptor>({
		activatorEvent,
		activators: activators.current,
		active,
		activeNodeRect: activeNodeRect.current,
		ariaDescribedById: {
			draggable: draggableDescribedById,
		},
		dispatch,
		draggableNodes,
		over,
		measureDroppableContainers,
	});

	function getAutoScrollerOptions() {
		const activeSensorDisablesAutoscroll = activeSensor?.autoScrollEnabled === false;
		const autoScrollGloballyDisabled =
			typeof autoScroll === 'object' ? autoScroll.enabled === false : autoScroll === false;
		const enabled = isInitialized && !activeSensorDisablesAutoscroll && !autoScrollGloballyDisabled;

		if (typeof autoScroll === 'object') {
			return {
				...autoScroll,
				enabled,
			};
		}

		return {enabled};
	}

	setContext(DndMonitorContextKey, registerMonitorListener);
	setContext(InternalContextKey, () => internalContext);
	setContext(PublicContextKey, () => publicContext);
	setContext(ActiveDraggableContextKey, () => transform);
</script>

{@render children?.()}
<RestoreFocus disabled={accessibility?.restoreFocus === false} />
<Accessibility {...accessibility} hiddenTextDescribedById={draggableDescribedById} />
