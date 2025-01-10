import type {State} from './types.js';
import {Action, type Actions} from './actions.js';
import {DroppableContainersMap} from './constructors.js';

export function useReducer(): [State, (action: Actions) => void] {
	const state: State = $state({
		draggable: {
			active: null,
			initialCoordinates: {x: 0, y: 0},
			nodes: new Map(),
			translate: {x: 0, y: 0},
		},
		droppable: {
			containers: new DroppableContainersMap(),
		},
	});

	// Action handlers
	function dispatch(action: Actions) {
		switch (action.type) {
			case Action.DragStart:
				state.draggable.initialCoordinates = action.initialCoordinates;
				state.draggable.active = action.active;
				break;

			case Action.DragMove:
				if (state.draggable.active == null) return;
				state.draggable.translate = {
					x: action.coordinates.x - state.draggable.initialCoordinates.x,
					y: action.coordinates.y - state.draggable.initialCoordinates.y,
				};
				break;

			case Action.DragEnd:
			case Action.DragCancel:
				state.draggable.active = null;
				state.draggable.initialCoordinates = {x: 0, y: 0};
				state.draggable.translate = {x: 0, y: 0};
				break;

			case Action.RegisterDroppable: {
				const {element} = action;
				const {id} = element;
				const containers = new DroppableContainersMap(state.droppable.containers);
				containers.set(id, element);
				state.droppable.containers = containers;
				break;
			}

			case Action.SetDroppableDisabled: {
				const {id, key, disabled} = action;
				const element = state.droppable.containers.get(id);
				if (!element || key !== element.key) return;
				const containers = new DroppableContainersMap(state.droppable.containers);
				containers.set(id, {...element, disabled});
				state.droppable.containers = containers;
				break;
			}

			case Action.UnregisterDroppable: {
				const {id, key} = action;
				const element = state.droppable.containers.get(id);
				if (!element || key !== element.key) return;
				const containers = new DroppableContainersMap(state.droppable.containers);
				containers.delete(id);
				state.droppable.containers = containers;
				break;
			}
		}
	}

	return [state, dispatch];
}
