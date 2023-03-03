// no async support in tailwind config
const { readFileSync } = require("fs");

/**
 * @param {string} filePath
 * @param {(line: string) => boolean} filterLine
 * @param {(name: string) => string} transformName
 * @returns {Record<string, string>} key-value
 */
function cssVarsToObject(filePath, filterLine, transformName) {
	const contents = readFileSync(filePath, "utf-8");
	const vars = contents
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.startsWith("--") && filterLine(line))
		.map((line) => {
			const name = line.split(":")[0].trim();

			return [transformName(name), `var(${name})`];
		});

	return Object.fromEntries(vars);
}

const colors = cssVarsToObject(
	"./src/renderer/style/colors.css",
	(line) => line.startsWith("--color-"),
	(name) => name.replace(/^--color-(\w*)-(\d*)/, "$1$2"),
);

module.exports = { colors };

if (require.main === module) {
	console.log({ colors });
}
