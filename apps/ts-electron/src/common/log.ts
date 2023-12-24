/* eslint-disable no-console */

const logError = console.error.bind(console);
const noop = () => undefined;

let log: typeof console.log = noop;
let logWarn: typeof console.warn = noop;
let logTime: typeof console.time = noop;
let logTimeEnd: typeof console.timeEnd = noop;

if (import.meta.env.DEV) {
	log = console.log.bind(console);
	logWarn = console.warn.bind(console);
	logTime = console.time.bind(console);
	logTimeEnd = console.timeEnd.bind(console);
}

export { log, logWarn, logError, logTime, logTimeEnd };
