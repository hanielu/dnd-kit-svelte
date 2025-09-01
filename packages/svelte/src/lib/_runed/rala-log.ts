// Log only in development mode
export function debugLog(...args: any[]) {
	if (import.meta.env.MODE !== "production") {
		// Get the stack trace to find the caller's location
		const stack = new Error().stack;
		// Get the caller's line (index 2 because 0 is Error, 1 is debugLog, 2 is caller)
		const caller = stack?.split("\n")[2]?.trim();

		// Safe stringify function that handles circular references
		const safeStringify = (obj: any): string => {
			const seen = new WeakSet();
			return JSON.stringify(
				obj,
				(key, value) => {
					if (typeof value === "object" && value !== null) {
						if (seen.has(value)) {
							return "[Circular Reference]";
						}
						seen.add(value);
					}
					return value;
				},
				2
			);
		};

		// Format the arguments, handling objects properly
		const formattedArgs = args.map((arg) => (typeof arg === "object" ? safeStringify(arg) : String(arg)));

		// Combine debug message and caller location in a single log
		console.log(
			`%c[DEBUG]%c ${formattedArgs.join(" ")} %c(${caller})`,
			"color: #7f7f7f", // Style for [DEBUG]
			"color: inherit", // Reset color for the main message
			"color: #7f7f7f" // Style for the caller location
		);
	}
}
