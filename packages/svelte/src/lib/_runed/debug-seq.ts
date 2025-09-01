let localSeq = 0;

export function nextSeq(): number {
	if (typeof window !== "undefined") {
		const w = window as any;
		w.__MOTION_DEBUG_SEQ__ = (w.__MOTION_DEBUG_SEQ__ || 0) + 1;
		return w.__MOTION_DEBUG_SEQ__;
	}
	localSeq += 1;
	return localSeq;
}
