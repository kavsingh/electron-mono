import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { generate } from "ts-to-zod";

import { formatTypescriptContent } from "./format";

async function getElectronTypesPath() {
	// eslint-disable-next-line @typescript-eslint/await-thenable
	const electronEntryPath = await import.meta.resolve("electron");
	const electronModulePath = path.parse(electronEntryPath).dir;

	return path.join(electronModulePath, "electron.d.ts");
}

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function nameFilter(name: string) {
	// return true;
	return /opendialogoptions/i.test(name) || /filefilter/i.test(name);
}

export default async function genElectronZod(outFile: string) {
	const typesPath = await getElectronTypesPath();
	const result = generate({
		nameFilter,
		sourceText: (await readFile(typesPath)).toString(),
	});
	const rawSchema = result.getZodSchemasFile(typesPath);
	const output = await formatTypescriptContent(`
		${rawSchema.replace(/^const electron/gm, "export const electron")}
	`);

	return writeFile(outFile, output, "utf-8");
}

if (
	// bun has bun executable at argv[0], file path at argv[1]
	process.argv[1] &&
	fileURLToPath(import.meta.url) === process.argv[1]
) {
	void genElectronZod(path.join(__dirname, "../src/common/schema/electron.ts"));
}
