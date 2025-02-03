import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { generate } from "ts-to-zod";

import { formatTypescriptContent } from "./format.ts";

const dirname = path.dirname(fileURLToPath(import.meta.url));

if (fileURLToPath(import.meta.url) === process.argv[1]) {
	await genElectronZod(
		path.resolve(dirname, "../src/common/schema/electron.ts"),
	);
}

export default async function genElectronZod(outFile: string) {
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

function getElectronTypesPath() {
	return path.resolve(dirname, "../node_modules/electron/electron.d.ts");
}

function nameFilter(name: string) {
	return /opendialogoptions/i.test(name) || /filefilter/i.test(name);
}
