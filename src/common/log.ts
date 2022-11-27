const noop = () => undefined;

let log: typeof console.log = noop;
let warn: typeof console.warn = noop;
let error: typeof console.error = noop;

if (MODE === "development") {
	/* eslint-disable no-console */
	log = console.log.bind(console);
	warn = console.warn.bind(console);
	error = console.error.bind(console);
	/* eslint-enable */
}

export { log, warn, error };
