import { defineConfig } from "@openapi-codegen/cli";
import {
	generateSchemaTypes,
	generateReactQueryComponents,
} from "@openapi-codegen/typescript";

export default defineConfig({
	"native-api": {
		from: {
			relativePath: ".native-api/openapi.yml",
			source: "file",
		},
		outputDir: "src/renderer/services/native-api/__generated__",
		to: async (context) => {
			const filenamePrefix = "native-api";
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
