import { BigIntResolver } from "graphql-scalars";

import type { IGraphQLConfig } from "graphql-config";

const scalars = {
	BigInt: BigIntResolver.extensions["codegenScalarType"],
};

const config: IGraphQLConfig = {
	schema: "./src/main/graphql/schema.gql",
	documents: "./src/renderer/**/*.gql",
	extensions: {
		codegen: {
			generates: {
				"./src/main/graphql/__generated__/resolver-types.ts": {
					config: { scalars, useIndexSignature: true },
					plugins: ["typescript", "typescript-resolvers"],
				},
				"./src/renderer/graphql/__generated__/types.ts": {
					config: { scalars },
					plugins: ["typescript"],
				},
				"./src/renderer/": {
					preset: "near-operation-file",
					presetConfig: {
						extension: ".generated.tsx",
						baseTypesPath: "graphql/__generated__/types.ts",
					},
					config: { scalars },
					plugins: ["typescript-operations", "typed-document-node"],
				},
			},
		},
	},
};

export default config;
