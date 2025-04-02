import type {
	Definition,
	Schema,
	Mutation,
	Query,
	SendFromMain,
	SendFromRenderer,
} from "./internal";

export function query<TResponse, TInput>(): Query<TResponse, TInput> {
	return {
		operation: "query",
		input: undefined as TInput,
		response: undefined as TResponse,
	};
}

export function mutation<TResponse, TInput>(): Mutation<TResponse, TInput> {
	return {
		operation: "mutation",
		input: undefined as TInput,
		response: undefined as TResponse,
	};
}

export function sendFromMain<TPayload>(): SendFromMain<TPayload> {
	return {
		operation: "sendFromMain",
		payload: undefined as TPayload,
	};
}

export function sendFromRenderer<TPayload>(): SendFromRenderer<TPayload> {
	return {
		operation: "sendFromRenderer",
		payload: undefined as TPayload,
	};
}

export function defineElectronTypedIpcSchema<TDefinition extends Definition>(
	definition: TDefinition,
) {
	return Object.fromEntries(
		Object.entries(definition).map(([key, def]) => [
			key,
			{ ...def, channel: key },
		]),
	) as unknown as Schema<TDefinition>;
}
