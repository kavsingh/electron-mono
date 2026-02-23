import chalk from "chalk";
import log from "electron-log";

// oxlint-disable eslint/no-console
const consoleWriteFn: typeof log.transports.console.writeFn = ({ message }) => {
	const header = message.variables?.processType ?? "-";
	const content = message.data.join("\n");

	switch (message.level) {
		case "error":
			console.error(chalk.bgRed(` ${header} `), content);
			break;
		case "warn":
			console.warn(chalk.bgYellow(` ${header} `), content);
			break;
		default:
			console.log(chalk.dim(header), content);
			break;
	}
};
// oxlint-enable

export function initLogging() {
	log.transports.console.writeFn = consoleWriteFn;
	log.transports.file.format =
		"[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{processType}] [{level}] {text}";

	log.initialize();
}
