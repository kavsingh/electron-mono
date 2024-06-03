export function tryOr<TReturn>(fn: () => TReturn, fallback: TReturn) {
	try {
		return fn();
	} catch {
		return fallback;
	}
}
