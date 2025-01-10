import {getContext} from 'svelte';
import {defaultMeasuringConfiguration} from '../components/dnd-context/defaults.js';
import {noop} from '../utilities/index.js';
import {DroppableContainersMap} from './constructors.js';
import type {PublicContextDescriptor, InternalContextDescriptor} from './types.js';

export const defaultPublicContext: PublicContextDescriptor = {
	activatorEvent: null,
	active: null,
	activeNode: null,
	activeNodeRect: null,
	collisions: null,
	containerNodeRect: null,
	draggableNodes: new Map(),
	droppableRects: new Map(),
	droppableContainers: new DroppableContainersMap(),
	over: null,
	dragOverlay: {
		nodeRef: null,
		rect: null,
		setRef: noop,
	},
	scrollableAncestors: [],
	scrollableAncestorRects: [],
	measuringConfiguration: defaultMeasuringConfiguration,
	measureDroppableContainers: noop,
	windowRect: null,
	measuringScheduled: false,
};

export const defaultInternalContext: InternalContextDescriptor = {
	activatorEvent: null,
	activators: [],
	active: null,
	activeNodeRect: null,
	ariaDescribedById: {
		draggable: '',
	},
	dispatch: noop,
	draggableNodes: new Map(),
	over: null,
	measureDroppableContainers: noop,
};

export const InternalContextKey = Symbol('InternalContext');
export const PublicContextKey = Symbol('PublicContext');

export function getInternalContext() {
	return getContext<{current: InternalContextDescriptor}>(InternalContextKey);
}

export function getDndContext() {
	return getContext<{current: PublicContextDescriptor}>(PublicContextKey);
}
