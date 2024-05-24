export default function mockCreator<T extends object>(
	defaults: T | ((partialMock: Partial<T>) => T),
) {
	return function mock(partial: Partial<T> = {}): T {
		if (typeof defaults === "function") return defaults(partial);

		return { ...defaults, ...partial };
	};
}
