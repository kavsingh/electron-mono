import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { generate } from "ts-to-zod";

import { formatTypescriptContent } from "./format.ts";

function getElectronTypesPath() {
	return path.join(
		path.dirname(fileURLToPath(import.meta.resolve("electron"))),
		"electron.d.ts",
	);
}

function nameFilter(name: string) {
	return /opendialogoptions/i.test(name) || /filefilter/i.test(name);
}

export async function genElectronZod(outFile: string) {
	const typesPath = getElectronTypesPath();
	const result = generate({
		nameFilter,
		sourceText: (await readFile(typesPath)).toString(),
	});

	if (result.errors.length) console.warn(result.errors.join(""));

	const rawSchema = result.getZodSchemasFile(typesPath);
	const output = await formatTypescriptContent(`
		${rawSchema.replace(/^const electron/gm, "export const electron")}
	`);

	return writeFile(outFile, output, "utf-8");
}

if (import.meta.filename === process.argv[1]) {
	await genElectronZod(
		path.resolve(import.meta.dirname, "../src/common/schema/electron.ts"),
	);
}
