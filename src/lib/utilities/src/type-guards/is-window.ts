export function isWindow(element: object): element is typeof window {
	const elementString = Object.prototype.toString.call(element);
	return (
		elementString === '[object Window]' ||
		// In Electron context the Window object serializes to [object global]
		elementString === '[object global]'
	);
}
