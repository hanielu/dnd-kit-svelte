import {box} from 'svelte-toolbelt';
import type {SyntheticEventName, UniqueIdentifier} from '../../types/index.js';

export type SyntheticListener = {
	eventName: SyntheticEventName;
	handler: (event: Event, id: UniqueIdentifier) => void;
};

export type SyntheticListeners = SyntheticListener[];

export type SyntheticListenerMap = Record<string, Function>;

export function useSyntheticListeners(args: () => [listeners: SyntheticListeners, id: UniqueIdentifier]) {
	return box.with(() => {
		const [listeners, id] = args();
		return listeners.reduce<SyntheticListenerMap>((acc, {eventName, handler}) => {
			acc[eventName] = (event: Event) => {
				handler(event, id);
			};

			return acc;
		}, {} as SyntheticListenerMap);
	});
}
