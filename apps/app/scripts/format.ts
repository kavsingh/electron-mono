import { format } from "prettier";

import config from "../prettier.config";

import type { Options } from "prettier";

export const formatTypescriptContent = prettifier("typescript");

function prettifier(parser: NonNullable<Options["parser"]>) {
	return function prettify(content: string) {
		return format(content, { ...config, parser });
	};
}
