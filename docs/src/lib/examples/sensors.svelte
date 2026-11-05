<script lang="ts">
	import { DragDropProvider, KeyboardSensor, PointerSensor, useDraggable } from "@dnd-kit-svelte/svelte";
	import { PointerActivationConstraints } from "@dnd-kit/dom";

	const options = [
		{ id: "default", label: "Default", sensors: undefined },
		{
			id: "distance",
			label: "Move 20px",
			sensors: [
				PointerSensor.configure({
					activationConstraints: [new PointerActivationConstraints.Distance({ value: 20 })],
				}),
				KeyboardSensor,
			],
		},
		{
			id: "delay",
			label: "Hold 500ms",
			sensors: [
				PointerSensor.configure({
					activationConstraints: [new PointerActivationConstraints.Delay({ value: 500, tolerance: 5 })],
				}),
				KeyboardSensor,
			],
		},
	];
</script>

<DragDropProvider>
	<div class="grid gap-3 sm:grid-cols-3">
		{#each options as option (option.id)}
			{const { ref, isDragging } = useDraggable({ id: option.id, sensors: option.sensors })}
			<div class="h-36 flex-s-center rd-3xl bg-zone">
				<button
					{@attach ref}
					class={["px-4 py-3 rd-xl fw-bold text-white", isDragging.current ? "bg-ink" : "bg-orange"]}
				>
					{option.label}
				</button>
			</div>
		{/each}
	</div>
</DragDropProvider>
