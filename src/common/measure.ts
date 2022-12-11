import { error, log } from "./log";

let measuredAsyncFn: MeasuredAsyncFn = (_id, fn) => fn;

// for some reason import.meta.env.DEV is false despite MODE development
// TODO: keep eye out for a fix
if (import.meta.env.MODE === "development") {
	measuredAsyncFn =
		(id, fn) =>
		async (...args) => {
			log(`called ${id}`);

			const start = Date.now();

			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const result = await fn(...args);

				log(`${id} succeeded in ${Date.now() - start}ms`);

				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return result;
			} catch (reason) {
				error(`${id} failed in ${Date.now() - start}ms`, reason);

				throw reason;
			}
		};
}

export { measuredAsyncFn };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MeasuredAsyncFn = <T extends (...args: any[]) => Promise<any>>(
	id: string,
	fn: T,
) => (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>;
