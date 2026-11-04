import type { Data } from "@dnd-kit/abstract";
import { Draggable, type DraggableInput } from "@dnd-kit/dom";
import { deepEqual } from "@dnd-kit/state";
import {
	lens,
	resolve,
	resolveObject,
	useDeepSignal,
	useOnValueChange,
	type MaybeGetterObject,
} from "#lib/reactivity/index.js";
import { attachTo } from "../attachments.js";
import { useInstance } from "../hooks/use-instance.svelte.js";

/** `DraggableInput`, where every property may also be a getter (`index: () => index`) to stay reactive. */
export type UseDraggableInput<T extends Data = Data> = MaybeGetterObject<Omit<DraggableInput<T>, "register">>;

export function useDraggable<T extends Data = Data>(input: UseDraggableInput<T>) {
	const draggable = useInstance((manager) => new Draggable({ ...resolveObject(input), register: false }, manager));
	const tracked = useDeepSignal(draggable);
	const deep = { equals: deepEqual };

	useOnValueChange(
		() => resolve(input.id),
		(id) => (draggable.id = id)
	);
	useOnValueChange(
		() => resolve(input.handle),
		(handle) => (draggable.handle = handle),
		{ pre: true }
	);
	useOnValueChange(
		() => resolve(input.element),
		(element) => (draggable.element = element),
		{ pre: true }
	);
	useOnValueChange(
		() => resolve(input.data),
		(data) => data && (draggable.data = data)
	);
	useOnValueChange(
		() => resolve(input.disabled),
		(disabled) => (draggable.disabled = disabled === true)
	);
	useOnValueChange(
		() => resolve(input.sensors),
		(sensors) => (draggable.sensors = sensors),
		deep
	);
	useOnValueChange(
		() => resolve(input.modifiers),
		(modifiers) => (draggable.modifiers = modifiers),
		deep
	);
	useOnValueChange(
		() => resolve(input.plugins),
		(plugins) => (draggable.plugins = plugins),
		deep
	);
	useOnValueChange(
		() => resolve(input.alignment),
		(alignment) => (draggable.alignment = alignment)
	);

	return {
		draggable: tracked,
		isDragging: lens(() => tracked.isDragging),
		isDropping: lens(() => tracked.isDropping),
		isDragSource: lens(() => tracked.isDragSource),
		ref: attachTo(draggable, "element", true),
		handleRef: attachTo(draggable, "handle"),
	};
}
