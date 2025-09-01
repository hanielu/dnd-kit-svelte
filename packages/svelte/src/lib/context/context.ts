import {DragDropManager} from '@dnd-kit/dom';
import {Context} from 'runed';

export const defaultManager = new DragDropManager();

export const DragDropContext = new Context<DragDropManager | null>('DragDropContext', defaultManager);
