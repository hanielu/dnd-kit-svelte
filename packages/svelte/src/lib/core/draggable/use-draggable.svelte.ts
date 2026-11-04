import type { Data } from "@dnd-kit/abstract";
import { Draggable, type DraggableInput } from "@dnd-kit/dom";
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

/** `DraggableInput`, where every property may also be a getter (`index: () => index`) to stay reactive. */
export type UseDraggableInput<T extends Data = Data> = MaybeGetterObject<Omit<DraggableInput<T>, "register">>;

export function useDraggable<T extends Data = Data>(input: UseDraggableInput<T>) {
	const draggable = useInstance((manager) => new Draggable({ ...resolveObject(input), register: false }, manager));
	const tracked = useDeepSignal(draggable);
	const write = assignTo(draggable);
	type Fields = Partial<Draggable<T>>;

	useSync((): Fields => ({ element: resolve(input.element), handle: resolve(input.handle) }), write, { pre: true });
	useSync(
		(): Fields => ({
			id: resolve(input.id),
			data: resolve(input.data),
			disabled: resolve(input.disabled) === true,
			sensors: resolve(input.sensors),
			modifiers: resolve(input.modifiers),
			plugins: resolve(input.plugins),
			alignment: resolve(input.alignment),
		}),
		write
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
