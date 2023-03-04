import { format } from "prettier";

import config from "../.prettierrc";

import type { Options, Config } from "prettier";

function prettifier(parser: NonNullable<Options["parser"]>) {
	return function prettify(content: string) {
		return format(content, { ...(config as Config), parser });
	};
}

export const formatTypescriptContent = prettifier("typescript");
