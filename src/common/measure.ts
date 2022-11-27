import { error, log } from "./log";

const isDev = process.env["NODE_ENV"] === "development";

export const measuredAsyncFn = <T extends GenericAsyncFn>(
	name: string,
	fn: T,
) =>
	isDev
		? async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
				log(`called ${name}`);

				const start = Date.now();

				try {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					const result = await fn(...args);

					log(`${name} succeeded in ${Date.now() - start}ms`);

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return result;
				} catch (reason) {
					error(`${name} failed in ${Date.now() - start}ms`, reason);

					throw reason;
				}
		  }
		: fn;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericAsyncFn = (...args: any[]) => any;
