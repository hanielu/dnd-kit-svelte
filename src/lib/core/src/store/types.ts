import type {ClientRect} from '../types/rect.js';
import type {Collision} from '../utilities/algorithms/index.js';
import type {Coordinates, DeepRequired} from '$utilities';
import type {DroppableContainersMap} from './constructors.js';
import type {UniqueIdentifier} from '../types/index.js';
import type {MeasuringConfiguration} from '../components/dnd-context/types.js';
import type {SyntheticListeners} from '../hooks/utilities/index.js';
import type {Actions} from './actions.js';

export interface DraggableElement {
	node: DraggableNode;
	id: UniqueIdentifier;
	index: number;
	collection: string;
	disabled: boolean;
}

type AnyData = Record<string, any>;

export type Data<T = AnyData> = T & AnyData;

// this is done because svelte doesn't need refs to hold values for the lifetime of the component
// if rerenders are needed, then change this to a `WritableBox`
type MutableRef<T> = T;

export type DataRef<T = AnyData> = MutableRef<Data<T> | undefined>;

export interface DroppableContainer {
	id: UniqueIdentifier;
	key: UniqueIdentifier;
	data: DataRef;
	disabled: boolean;
	node: MutableRef<HTMLElement | null>;
	rect: MutableRef<ClientRect | null>;
}

export interface Active {
	id: UniqueIdentifier;
	data: DataRef;
	rect: MutableRef<{
		initial: ClientRect | null;
		translated: ClientRect | null;
	}>;
}

export interface Over {
	id: UniqueIdentifier;
	rect: ClientRect;
	disabled: boolean;
	data: DataRef;
}

export type DraggableNode = {
	id: UniqueIdentifier;
	key: UniqueIdentifier;
	node: MutableRef<HTMLElement | null>;
	activatorNode: MutableRef<HTMLElement | null>;
	data: DataRef;
};

export type DraggableNodes = Map<UniqueIdentifier, DraggableNode | undefined>;

export type DroppableContainers = DroppableContainersMap;

export type RectMap = Map<UniqueIdentifier, ClientRect>;

export interface State {
	droppable: {
		containers: DroppableContainers;
	};
	draggable: {
		active: UniqueIdentifier | null;
		initialCoordinates: Coordinates;
		nodes: DraggableNodes;
		translate: Coordinates;
	};
}

export interface PublicContextDescriptor {
	activatorEvent: Event | null;
	active: Active | null;
	activeNode: HTMLElement | null;
	activeNodeRect: ClientRect | null;
	collisions: Collision[] | null;
	containerNodeRect: ClientRect | null;
	draggableNodes: DraggableNodes;
	droppableContainers: DroppableContainers;
	droppableRects: RectMap;
	over: Over | null;
	dragOverlay: {
		nodeRef: MutableRef<HTMLElement | null>;
		rect: ClientRect | null;
		setRef: (element: HTMLElement | null) => void;
	};
	scrollableAncestors: Element[];
	scrollableAncestorRects: ClientRect[];
	measuringConfiguration: DeepRequired<MeasuringConfiguration>;
	measureDroppableContainers(ids: UniqueIdentifier[]): void;
	measuringScheduled: boolean;
	windowRect: ClientRect | null;
}

export interface InternalContextDescriptor {
	activatorEvent: Event | null;
	activators: SyntheticListeners;
	active: Active | null;
	activeNodeRect: ClientRect | null;
	ariaDescribedById: {
		draggable: string;
	};
	dispatch: (action: Actions) => void;
	draggableNodes: DraggableNodes;
	over: Over | null;
	measureDroppableContainers(ids: UniqueIdentifier[]): void;
}
