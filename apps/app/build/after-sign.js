import { notarize as electronNotarize } from "@electron/notarize";

/** @param {import("electron-builder").AfterPackContext} context */
async function afterSign(context) {
	console.log("afterSign hook triggered");

	await notarize(context);
}

/** @param {import("electron-builder").AfterPackContext} context */
async function notarize(context) {
	console.log("notarizing app...");

	if (process.platform !== "darwin") {
		console.log(`skipping notarize: not darwin.`);

		return;
	}

	if (!process.env["CI"]) {
		console.log(`skipping notarize: not in CI.`);

		return;
	}

	const appleApiKey = process.env["APPLE_API_KEY"];
	const appleApiKeyId = process.env["APPLE_API_KEY_ID"];
	const appleApiIssuer = process.env["APPLE_API_ISSUER"];

	if (!(appleApiKey && appleApiKeyId && appleApiIssuer)) {
		console.error(
			"could not notarize, APPLE_API_KEY, APPLE_API_KEY_ID and APPLE_API_ISSUER env variables must be set.",
		);

		return;
	}

	const { appOutDir, packager } = context;
	const { productFilename, macBundleIdentifier } = packager.appInfo;

	try {
		await electronNotarize({
			appleApiKey,
			appleApiKeyId,
			appleApiIssuer,
			appPath: `${appOutDir}/${productFilename}.app`,
		});
	} catch (reason) {
		console.error(reason);
	}

	console.log(`done notarizing ${macBundleIdentifier}.`);
}

module.exports = afterSign;
