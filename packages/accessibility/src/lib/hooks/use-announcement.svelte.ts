export function useAnnouncement() {
	let announcement = $state('');
	const announce = (value: string | undefined) => {
		if (value != null) {
			announcement = value;
		}
	};

	return {
		announce,
		announcement: {
			get current() {
				return announcement;
			},
		},
	} as const;
}
