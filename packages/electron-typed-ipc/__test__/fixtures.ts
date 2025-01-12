import type {
	DefineElectronTypedIpcSchema,
	ElectronTypedIpcMutation,
	ElectronTypedIpcQuery,
	ElectronTypedIpcSendFromMain,
	ElectronTypedIpcSendFromRenderer,
} from "../src/common";

export type TypedIpcApi = DefineElectronTypedIpcSchema<{
	queryVoidArgVoidReturn: ElectronTypedIpcQuery<void, void>;
	queryVoidArgStringReturn: ElectronTypedIpcQuery<string, void>;
	queryNumberArgVoidReturn: ElectronTypedIpcQuery<void, number>;
	queryStringArgNumberReturn: ElectronTypedIpcQuery<number, string>;

	mutationVoidArgVoidReturn: ElectronTypedIpcMutation<void, void>;
	mutationVoidArgStringReturn: ElectronTypedIpcMutation<string, void>;
	mutationNumberArgVoidReturn: ElectronTypedIpcMutation<void, number>;
	mutationStringArgNumberReturn: ElectronTypedIpcMutation<number, string>;

	sendVoidFromMain: ElectronTypedIpcSendFromMain<void>;
	sendPayloadFromMain: ElectronTypedIpcSendFromMain<SendFromMainPayload>;

	sendVoidFromRenderer: ElectronTypedIpcSendFromRenderer<void>;
	sendPayloadFromRenderer: ElectronTypedIpcSendFromRenderer<SendFromRendererPayload>;
}>;

export type SendFromMainPayload = { type: "sendFromMain" };
export type SendFromRendererPayload = { type: "sendFromRenderer" };
