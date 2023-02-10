import { error, log } from "./log";

let measuredAsyncFn: MeasuredAsyncFn = (_id, fn) => fn;

if (import.meta.env.DEV) {
	measuredAsyncFn = (id, fn) => {
		async function measured(...args: Parameters<typeof fn>) {
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
		}

		Object.defineProperty(measured, "name", {
			value: `${fn.name || "anonymous"}_measured`,
		});

		return measured;
	};
}

export { measuredAsyncFn };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MeasuredAsyncFn = <T extends (...args: any[]) => Promise<any>>(
	id: string,
	fn: T,
) => (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>;
