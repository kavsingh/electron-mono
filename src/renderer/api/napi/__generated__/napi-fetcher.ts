import { NATIVE_API_APP_TOKEN } from "~/common/napi/constants";
import { NapiContext } from "./napi-context";

const baseUrl = "https://api.native-instruments.com/v1";

export type ErrorWrapper<TError> =
	| TError
	| { status: "unknown"; payload: string };

export type NapiFetcherOptions<TBody, THeaders, TQueryParams, TPathParams> = {
	url: string;
	method: string;
	body?: TBody;
	headers?: THeaders;
	queryParams?: TQueryParams;
	pathParams?: TPathParams;
} & NapiContext["fetcherOptions"];

export async function napiFetch<
	TData,
	TError,
	TBody extends {} | undefined | null,
	THeaders extends {},
	TQueryParams extends {},
	TPathParams extends {},
>({
	url,
	method,
	body,
	headers,
	pathParams,
	queryParams,
}: NapiFetcherOptions<
	TBody,
	THeaders,
	TQueryParams,
	TPathParams
>): Promise<TData> {
	try {
		const response = await window.fetch(
			`${baseUrl}${resolveUrl(url, queryParams, pathParams)}`,
			{
				method: method.toUpperCase(),
				body: body ? JSON.stringify(body) : null,
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${NATIVE_API_APP_TOKEN}`,
					...headers,
				},
			},
		);
		if (!response.ok) {
			let error: ErrorWrapper<TError>;
			try {
				error = await response.json();
			} catch (e) {
				error = {
					status: "unknown" as const,
					payload:
						e instanceof Error
							? `Unexpected error (${e.message})`
							: "Unexpected error",
				};
			}

			throw error;
		}

		return await response.json();
	} catch (e) {
		throw {
			status: "unknown" as const,
			payload:
				e instanceof Error ? `Network error (${e.message})` : "Network error",
		};
	}
}

const resolveUrl = (
	url: string,
	queryParams: Record<string, string> = {},
	pathParams: Record<string, string> = {},
) => {
	let query = new URLSearchParams(queryParams).toString();
	if (query) query = `?${query}`;
	return url.replace(/\{\w*\}/g, (key) => pathParams[key.slice(1, -1)] ?? "") + query;
};
