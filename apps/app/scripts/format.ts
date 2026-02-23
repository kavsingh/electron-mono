import { format } from "oxfmt";

import config from "../../../.oxfmtrc.json" with { type: "json" };

export async function formatTypescriptContent(content: string) {
	const result = await format(
		"content.ts",
		content,
		// @ts-expect-error deep string consts
		config,
	);

	return result.code;
}
