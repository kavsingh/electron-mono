import { net } from "electron";

import { describe, it, expect, vi, beforeEach } from "vitest";

import {
	appProtocolHandler,
	APP_PROTOCOL_SCHEME,
	APP_RENDERER_HOST,
	APP_RENDERER_URL,
} from "./app-protocol";

const fileContentsResponse = new Response("file contents", { status: 200 });

vi.mock("electron", () => ({
	net: { fetch: vi.fn(() => Promise.resolve(fileContentsResponse)) },
}));

describe("app-protocol", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe(appProtocolHandler, () => {
		it("should handle valid renderer bundle root path request", async () => {
			expect.hasAssertions();

			const request = new Request(APP_RENDERER_URL);

			await expect(appProtocolHandler(request)).resolves.toStrictEqual(
				fileContentsResponse,
			);

			expect(net.fetch).toHaveBeenCalledWith(
				expect.stringMatching(/index\.html$/),
			);
		});

		it("should handle valid renderer bundle file path request", async () => {
			expect.hasAssertions();

			const request = new Request(`${APP_RENDERER_URL}some-file.js`);

			await expect(appProtocolHandler(request)).resolves.toStrictEqual(
				fileContentsResponse,
			);

			expect(net.fetch).toHaveBeenCalledWith(
				expect.stringMatching(/some-file\.js$/),
			);
		});

		it("should return 400 for invalid host", async () => {
			expect.hasAssertions();

			const request = new Request(
				`${APP_PROTOCOL_SCHEME}://invalid-host/some-path/`,
			);
			const response = await appProtocolHandler(request);

			expect(response.status).toBe(400);
			await expect(response.text()).resolves.toBe("invalid host");
			expect(response.headers.get("content-type")).toBe("text/html");
			expect(net.fetch).not.toHaveBeenCalled();
		});

		it("should return 500 for fetch errors", async () => {
			expect.hasAssertions();

			vi.mocked(net.fetch).mockRejectedValueOnce(new Error("Fetch failed"));

			const request = new Request(`${APP_RENDERER_URL}file.js`);
			const response = await appProtocolHandler(request);

			expect(response.status).toBe(500);
			expect(response.headers.get("content-type")).toBe("text/html");
			await expect(response.text()).resolves.toBe(
				"failed to load: Error: Fetch failed",
			);
		});

		it("should handle URLs with extra slashes", async () => {
			expect.hasAssertions();

			const request = new Request(
				`${APP_PROTOCOL_SCHEME}:///${APP_RENDERER_HOST}///file.js///`,
			);

			await expect(appProtocolHandler(request)).resolves.toStrictEqual(
				fileContentsResponse,
			);
		});

		it("should handle nested file paths", async () => {
			expect.hasAssertions();

			const request = new Request(`${APP_RENDERER_URL}assets/styles/main.css`);

			await expect(appProtocolHandler(request)).resolves.toStrictEqual(
				fileContentsResponse,
			);

			expect(net.fetch).toHaveBeenCalledWith(
				expect.stringMatching(/assets\/styles\/main\.css$/),
			);
		});

		describe("unsafe paths", () => {
			it("should return 400 for absolute path attempts", async () => {
				expect.hasAssertions();

				const request = new Request(`${APP_RENDERER_URL}/etc/passwd`);
				const response = await appProtocolHandler(request);

				expect(response.status).toBe(400);
				await expect(response.text()).resolves.toBe("unsafe path");
				expect(response.headers.get("content-type")).toBe("text/html");
				expect(net.fetch).not.toHaveBeenCalled();
			});

			// when we use e.g. new (URL | Request)("na-app://renderer/../../foo")
			// url.pathname will just be "/foo", with relative segments stripped out
			// leaving checks in place for safety
			it("should return 400 when accessing outside renderer dir", async () => {
				expect.hasAssertions();

				// eslint-disable-next-line @typescript-eslint/no-extraneous-class
				class MockUrl {
					constructor(input: string) {
						return {
							host: APP_RENDERER_HOST,
							pathname: input.replace(APP_RENDERER_URL, ""),
						};
					}
				}

				const urlSpy = vi
					.spyOn(globalThis, "URL", "get")
					// @ts-expect-error sparse mock
					.mockReturnValue(MockUrl);

				const request = {
					url: `${APP_RENDERER_URL}../../../etc/passwd`,
				} as Request;
				const result = await appProtocolHandler(request);

				expect(result.status).toBe(400);
				await expect(result.text()).resolves.toBe("unsafe path");
				expect(result.headers.get("content-type")).toBe("text/html");
				expect(net.fetch).not.toHaveBeenCalled();

				urlSpy.mockRestore();
			});
		});
	});
});
