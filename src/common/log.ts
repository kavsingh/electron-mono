const isDev = process.env["NODE_ENV"] === "development";
const noop = () => undefined;

/* eslint-disable no-console */
export const log = isDev ? console.log.bind(console) : noop;
export const warn = isDev ? console.warn.bind(console) : noop;
export const error = isDev ? console.error.bind(console) : noop;
/* eslint-enable */
