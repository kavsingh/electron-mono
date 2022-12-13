/* eslint-disable no-console */

const error = console.error.bind(console);
const noop = () => undefined;

let log: typeof console.log = noop;
let warn: typeof console.warn = noop;

if (import.meta.env.DEV) {
	log = console.log.bind(console);
	warn = console.warn.bind(console);
}

export { log, warn, error };
