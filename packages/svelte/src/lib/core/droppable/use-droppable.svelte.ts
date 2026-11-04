import type { Data } from "@dnd-kit/abstract";
import { defaultCollisionDetection } from "@dnd-kit/collision";
import { Droppable, type DroppableInput } from "@dnd-kit/dom";
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

/** `DroppableInput`, where every property may also be a getter (`id: () => id`) to stay reactive. */
export type UseDroppableInput<T extends Data = Data> = MaybeGetterObject<Omit<DroppableInput<T>, "register">>;

export function useDroppable<T extends Data = Data>(input: UseDroppableInput<T>) {
	const droppable = useInstance((manager) => new Droppable({ ...resolveObject(input), register: false }, manager));
	const tracked = useDeepSignal(droppable);

	useOnValueChange(
		() => resolve(input.id),
		(id) => (droppable.id = id)
	);
	useOnValueChange(
		() => resolve(input.element),
		(element) => (droppable.element = element),
		{ pre: true }
	);
	useOnValueChange(
		() => resolve(input.accept),
		(accept) => (droppable.accept = accept),
		{ equals: deepEqual }
	);
	useOnValueChange(
		() => resolve(input.collisionDetector),
		(detector) => (droppable.collisionDetector = detector ?? defaultCollisionDetection)
	);
	useOnValueChange(
		() => resolve(input.data),
		(data) => data && (droppable.data = data)
	);
	useOnValueChange(
		() => resolve(input.disabled),
		(disabled) => (droppable.disabled = disabled === true)
	);
	useOnValueChange(
		() => resolve(input.type),
		(type) => (droppable.type = type)
	);
	useOnValueChange(
		() => resolve(input.collisionPriority),
		(priority) => (droppable.collisionPriority = priority)
	);

	return {
		droppable: tracked,
		isDropTarget: lens(() => tracked.isDropTarget),
		ref: attachTo(droppable, "element", true),
	};
}
