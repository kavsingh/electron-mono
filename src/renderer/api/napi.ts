import axios from "axios";

import {
	NATIVE_API_APP_TOKEN,
	NATIVE_API_BASE_URL,
} from "~/common/napi/constants";

import type { AxiosError } from "axios";

export const napiClient = axios.create({
	baseURL: NATIVE_API_BASE_URL,
	headers: { Authorization: `Bearer ${NATIVE_API_APP_TOKEN}` },
});

export const isAxiosError = (value: unknown): value is AxiosError =>
	!!value && (value as AxiosError).isAxiosError;
