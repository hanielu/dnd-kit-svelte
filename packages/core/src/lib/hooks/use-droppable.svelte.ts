import {Action, getInternalContext, type Data} from '$core/store/index.js';
import type {ClientRect, UniqueIdentifier} from '$core/types/index.js';
import {unwrapResolvableObject, useNodeRef, useUniqueId, type ResolvableObject} from '@dnd-kit-svelte/utilities';
import {watch} from 'runed';
import {useResizeObserver} from './utilities/index.js';
import {box} from 'svelte-toolbelt';

interface ResizeObserverConfig {
	/** Whether the ResizeObserver should be disabled entirely */
	disabled?: boolean;
	/** Resize events may affect the layout and position of other droppable containers.
	 * Specify an array of `UniqueIdentifier` of droppable containers that should also be re-measured
	 * when this droppable container resizes. Specifying an empty array re-measures all droppable containers.
	 */
	updateMeasurementsFor?: UniqueIdentifier[];
	/** Represents the debounce timeout between when resize events are observed and when elements are re-measured */
	timeout?: number;
}

export type UseDroppableArguments = ResolvableObject<{
	id: UniqueIdentifier;
	disabled?: boolean;
	data?: Data;
	resizeObserverConfig?: ResizeObserverConfig;
}>;

const ID_PREFIX = 'Droppable';

const defaultResizeObserverConfig = {
	timeout: 25,
};

export function useDroppable(args: UseDroppableArguments) {
	const key = useUniqueId(ID_PREFIX);
	const {id, disabled = false, data, resizeObserverConfig} = $derived(unwrapResolvableObject(args));
	const {active, dispatch, over, measureDroppableContainers} = $derived(getInternalContext());

	const previous = {disabled};
	let resizeObserverConnected = false;
	const rect: ClientRect | null = null;
	let callbackId: NodeJS.Timeout | null = null;

	const {
		disabled: resizeObserverDisabled,
		updateMeasurementsFor,
		timeout: resizeObserverTimeout,
	} = $derived({
		...defaultResizeObserverConfig,
		...resizeObserverConfig,
	});

	const ids = $derived(updateMeasurementsFor ?? id);

	const handleResize = () => {
		if (!resizeObserverConnected) {
			// ResizeObserver invokes the `handleResize` callback as soon as `observe` is called,
			// assuming the element is rendered and displayed.
			resizeObserverConnected = true;
			return;
		}

		if (callbackId != null) {
			clearTimeout(callbackId);
		}

		callbackId = setTimeout(() => {
			measureDroppableContainers(Array.isArray(ids) ? ids : [ids]);
			callbackId = null;
		}, resizeObserverTimeout);
	};

	const resizeObserver = useResizeObserver(() => ({
		callback: handleResize,
		disabled: resizeObserverDisabled || !active,
	}));

	const handleNodeChange = (newElement: HTMLElement | null, previousElement: HTMLElement | null) => {
		if (!resizeObserver.current) {
			return;
		}

		if (previousElement) {
			resizeObserver.current.unobserve(previousElement);
			resizeObserverConnected = false;
		}

		if (newElement) {
			resizeObserver.current.observe(newElement);
		}
	};

	const [nodeRef, setNodeRef] = useNodeRef(handleNodeChange);

	$effect(() => {
		if (!resizeObserver.current || !nodeRef.current) {
			return;
		}

		resizeObserver.current.disconnect();
		resizeObserverConnected = false;
		resizeObserver.current.observe(nodeRef.current);
	});

	watch(
		() => id,
		() => {
			dispatch({
				type: Action.RegisterDroppable,
				element: {
					id,
					key,
					disabled,
					node: nodeRef.current,
					rect,
					data,
				},
			});

			return () => {
				dispatch({
					type: Action.UnregisterDroppable,
					key,
					id,
				});
			};
		}
	);

	$effect(() => {
		if (disabled !== previous.disabled) {
			dispatch({
				type: Action.SetDroppableDisabled,
				id,
				key,
				disabled,
			});

			previous.disabled = disabled;
		}
	});

	return {
		active: box.with(() => active),
		rect: box.with(() => rect),
		isOver: box.with(() => over?.id === id),
		node: nodeRef,
		over: box.with(() => over),
		setNodeRef,
	};
}
