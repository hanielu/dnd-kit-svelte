import type {Coordinates, UniqueIdentifier} from '../../types/index.js';
import type {SensorContext} from '../types.js';

export enum KeyboardCode {
	Space = 'Space',
	Down = 'ArrowDown',
	Right = 'ArrowRight',
	Left = 'ArrowLeft',
	Up = 'ArrowUp',
	Esc = 'Escape',
	Enter = 'Enter',
	Tab = 'Tab',
}

export type KeyboardCodes = {
	start: KeyboardEvent['code'][];
	cancel: KeyboardEvent['code'][];
	end: KeyboardEvent['code'][];
};

export type KeyboardCoordinateGetter = (
	event: KeyboardEvent,
	args: {
		active: UniqueIdentifier;
		currentCoordinates: Coordinates;
		context: SensorContext;
	}
) => Coordinates | void;
