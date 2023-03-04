import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { generate } from "ts-to-zod";

import { formatTypescriptContent } from "./format";

const typesPath = path.join(
	__dirname,
	"../node_modules/electron/electron.d.ts"
);

function nameFilter(name: string) {
	return /opendialogoptions/i.test(name) || /filefilter/i.test(name);
}

export default async function genElectronZod(outFile: string) {
	const result = generate({
		nameFilter,
		sourceText: (await readFile(typesPath)).toString(),
	});
	const rawSchemas = result.getZodSchemasFile(typesPath);
	const output = formatTypescriptContent(`
		${rawSchemas.replaceAll("const electron", "export const electron")}
	`);

	return writeFile(outFile, output, "utf-8");
}

if (require.main === module) {
	console.log(process.cwd());

	void genElectronZod(
		path.join(__dirname, "../src/common/schemas/electron.ts")
	);
}
