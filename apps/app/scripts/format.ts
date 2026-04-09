import { format } from "oxfmt";

import config from "../../../oxfmt.config.ts";

export async function formatTypescriptContent(content: string) {
	const result = await format("content.ts", content, config);

	return result.code;
}
