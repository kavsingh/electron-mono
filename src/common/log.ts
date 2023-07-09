const logError = console.error.bind(console);
const noop = () => undefined;

let log: typeof console.log = noop;
let logWarn: typeof console.warn = noop;

if (import.meta.env.DEV) {
	log = console.log.bind(console);
	logWarn = console.warn.bind(console);
}

export { log, logWarn, logError };
