import path from "node:path";
import { fileURLToPath } from "node:url";

import * as tsEslint from "typescript-eslint";

import baseConfig from "../../eslint.config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default tsEslint.config(
	...baseConfig,

	{
		settings: {
			"import-x/resolver": {
				"eslint-import-resolver-typescript": {
					project: path.resolve(dirname, "./tsconfig.json"),
				},
			},
		},
	},
);
