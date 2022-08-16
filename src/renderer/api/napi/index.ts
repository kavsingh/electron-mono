import axios from "axios";

import {
	NATIVE_API_APP_TOKEN,
	NATIVE_API_BASE_URL,
} from "~/common/napi/constants";

export * from "./__generated__/napi-components";
export * from "./__generated__/napi-schemas";

export const napiClient = axios.create({
	baseURL: NATIVE_API_BASE_URL,
	headers: { Authorization: `Bearer ${NATIVE_API_APP_TOKEN}` },
});
