import type {Attachment} from 'svelte/attachments';
import {isNodeAttached} from './is-node-attached.js';

export function makeRef<T, K extends keyof T & string>(obj: T, key: K): Attachment {
	return (node) => {
		(obj as any)[key] = node as any;
		return () => {
			if (isNodeAttached(node)) return;
			(obj as any)[key] = undefined;
		};
	};
}
