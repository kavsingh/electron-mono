const isDev = process.env["NODE_ENV"] === "development";
const noop = () => undefined;

let log: typeof console.log = noop;
let warn: typeof console.warn = noop;
let error: typeof console.error = noop;

if (MODE === "development") {
	/* eslint-disable no-console */
	log = isDev ? console.log.bind(console) : noop;
	warn = isDev ? console.warn.bind(console) : noop;
	error = isDev ? console.error.bind(console) : noop;
	/* eslint-enable */
}

export { log, warn, error };
