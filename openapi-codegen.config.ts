import { defineConfig } from "@openapi-codegen/cli";
import {
	generateSchemaTypes,
	generateReactQueryComponents,
} from "@openapi-codegen/typescript";

export default defineConfig({
	napi: {
		from: {
			relativePath: ".napi/openapi.yml",
			source: "file",
		},
		outputDir: "src/renderer/api/napi/__generated__",
		to: async (context) => {
			const filenamePrefix = "napi";
			const filenameCase = "kebab";

			context.openAPIDocument.servers =
				context.openAPIDocument.servers?.filter((server) =>
					/^prod/i.test(server.description ?? ""),
				) ?? [];

			console.log(context.openAPIDocument.servers);

			const { schemasFiles } = await generateSchemaTypes(context, {
				filenamePrefix,
				filenameCase,
			});

			await generateReactQueryComponents(context, {
				filenamePrefix,
				schemasFiles,
				filenameCase,
			});
		},
	},
});
