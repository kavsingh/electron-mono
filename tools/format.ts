import { format } from "prettier";

import config from "../.prettierrc";

import type { Options } from "prettier";

function prettifier(parser: NonNullable<Options["parser"]>) {
	return function prettify(content: string) {
		return format(content, { ...config, parser });
	};
}

export const formatTypescriptContent = prettifier("typescript");
