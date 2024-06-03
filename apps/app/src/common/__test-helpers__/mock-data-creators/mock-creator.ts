export default function mockCreator<TData>(defaults: TData) {
	return function createMockData(
		custom?: Partial<TData> | ((defaults: TData) => TData) | undefined,
	): TData {
		return typeof custom === "function"
			? custom(defaults)
			: { ...defaults, ...custom };
	};
}
