export function styleObjectToString(styleObj: Record<string, string | number | undefined>) {
	return Object.entries(styleObj)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => {
			// Add 'px' to numbers except for unitless properties
			const unitlessProps = ['opacity', 'zIndex', 'fontWeight', 'lineHeight', 'order', 'flexGrow', 'flexShrink'];
			const formattedValue = typeof value === 'number' && !unitlessProps.includes(key) ? `${value}px` : value;
			return `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${formattedValue}`;
		})
		.join(';');
}

export function styleStringToObject(styleStr: string): Record<string, string> {
	return styleStr.split(';').reduce((obj: Record<string, string>, style) => {
		const [key, value] = style.split(':');
		if (key && value) {
			obj[key] = value;
		}
		return obj;
	}, {});
}
