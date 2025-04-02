export type DefineElectronTypedIpcSchema<
	TDefinitions extends ElectronTypedIpcSchema,
> = TDefinitions;

export type ElectronTypedIpcSchema = Readonly<Record<string, Operation>>;

export type Operation = Query | Mutation | SendFromMain | SendFromRenderer;

export type Query<TResponse = unknown, TArg = unknown> = {
	operation: "query";
	arg: TArg;
	response: TResponse;
};

export type Mutation<TResponse = unknown, TArg = unknown> = {
	operation: "mutation";
	arg: TArg;
	response: TResponse;
};

export type SendFromMain<TPayload = unknown> = {
	operation: "sendFromMain";
	payload: TPayload;
};

export type SendFromRenderer<TPayload = unknown> = {
	operation: "sendFromRenderer";
	payload: TPayload;
};
