// useful for getting around exactOptionalPropertyTypes interop with 3rd party
// types
// StripUndefined<{ foo?: string | undefined }> = { foo?: string }
type StripUndefined<T> = {
	[K in keyof T]: T[K] extends infer U | undefined ? U : T[K];
};
