import type { Data } from "@dnd-kit/abstract";
import { defaultCollisionDetection } from "@dnd-kit/collision";
import { Droppable, type DroppableInput } from "@dnd-kit/dom";
import {
	assignTo,
	lens,
	resolve,
	resolveObject,
	useDeepSignal,
	useSync,
	type MaybeGetterObject,
} from "#lib/reactivity/index.js";
import { attachTo } from "../attachments.js";
import { useInstance } from "../hooks/use-instance.svelte.js";

/** `DroppableInput`, where every property may also be a getter (`id: () => id`) to stay reactive. */
export type UseDroppableInput<T extends Data = Data> = MaybeGetterObject<Omit<DroppableInput<T>, "register">>;

export function useDroppable<T extends Data = Data>(input: UseDroppableInput<T>) {
	const droppable = useInstance((manager) => new Droppable({ ...resolveObject(input), register: false }, manager));
	const tracked = useDeepSignal(droppable);
	const write = assignTo(droppable);
	type Fields = Partial<Droppable<T>>;

	useSync((): Fields => ({ element: resolve(input.element) }), write, { pre: true });
	useSync(
		(): Fields => ({
			id: resolve(input.id),
			data: resolve(input.data),
			disabled: resolve(input.disabled) === true,
			accept: resolve(input.accept),
			type: resolve(input.type),
			collisionDetector: resolve(input.collisionDetector) ?? defaultCollisionDetection,
			collisionPriority: resolve(input.collisionPriority),
		}),
		write
	);

	return {
		droppable: tracked,
		isDropTarget: lens(() => tracked.isDropTarget),
		ref: attachTo(droppable, "element", true),
	};
}
