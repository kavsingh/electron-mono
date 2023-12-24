/** @type {import("@electron/notarize")} */
const { notarize: electronNotarize } = require("@electron/notarize");

/** @param {import("electron-builder").AfterPackContext} context */
async function afterSign(context) {
	console.log("afterSign hook triggered");

	await notarize(context);
}

/** @param {import("electron-builder").AfterPackContext} context */
async function notarize(context) {
	console.log("notarizing app...");

	if (process.platform !== "darwin") {
		console.log(`skipping notarize, not darwin.`);

		return;
	}

	if (!process.env["CI"]) {
		console.log(`skipping notarize, not in CI.`);

		return;
	}

	const appleId = process.env["APPLE_ID"];
	const appleIdPassword = process.env["APPLE_ID_PASS"];

	if (!(appleId && appleIdPassword)) {
		console.error(
			"could not notarize, APPLE_ID and APPLE_ID_PASS env variables must be set.",
		);

		return;
	}

	const { appOutDir, packager } = context;
	const { productFilename, macBundleIdentifier } = packager.appInfo;

	try {
		await electronNotarize({
			appleId,
			appleIdPassword,
			appBundleId: macBundleIdentifier,
			appPath: `${appOutDir}/${productFilename}.app`,
		});
	} catch (reason) {
		console.error(reason);
	}

	console.log(`done notarizing ${macBundleIdentifier}.`);
}

module.exports = afterSign;
