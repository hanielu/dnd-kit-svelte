/**
 * `$effect`, owned by the block that calls the hook. While a component renders for the first time, Svelte defers every
 * `$effect` created inside it until the component has mounted, and the component then owns it. A hook called in a
 * `{const …}` tag inside `{#each}` would then outlive its item. An `$effect.pre` is created right away inside the
 * item, so the `$effect` it creates belongs to the item too, and still runs after `{@attach}` has set the element.
 */
export function useBlockEffect(fn: () => void | (() => void)): void {
	$effect.pre(() => {
		$effect(fn);
	});
}
