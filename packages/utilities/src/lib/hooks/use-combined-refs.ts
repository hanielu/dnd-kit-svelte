export function useCombinedRefs<T>(...refs: ((node: T) => void)[]): (node: T) => void {
	return (node: T) => {
		refs.forEach((ref) => ref(node));
	};
}
