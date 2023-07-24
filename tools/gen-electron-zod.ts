import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { generate } from "ts-to-zod";

import { formatTypescriptContent } from "./format";

const typesPath = path.join(
	__dirname,
	"../node_modules/electron/electron.d.ts",
);

function nameFilter(name: string) {
	return /opendialogoptions/i.test(name) || /filefilter/i.test(name);
}

export default async function genElectronZod(outFile: string) {
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

if (require.main === module) {
	void genElectronZod(path.join(__dirname, "../src/common/schema/electron.ts"));
}
