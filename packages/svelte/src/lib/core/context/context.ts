import {DragDropManager} from '@dnd-kit/dom';
import {lens, Context, type Lens} from 'runed';

export const defaultManager = new DragDropManager();

export const DragDropContext = new Context<Lens<DragDropManager | null>>(
	'DragDropContext',
	lens(() => defaultManager)
);
