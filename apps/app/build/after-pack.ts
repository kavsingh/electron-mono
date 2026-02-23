import { FuseVersion, FuseV1Options } from "@electron/fuses";
import { Arch } from "electron-builder";

import type { AfterPackContext } from "electron-builder";

// https://github.com/electron/electron/blob/main/docs/tutorial/fuses.md
function applyFuses(context: AfterPackContext): Promise<number> {
	return context.packager.addElectronFuses(context, {
		version: FuseVersion.V1,
		strictlyRequireAllFuses: true,

		// https://github.com/electron/fuses?tab=readme-ov-file#apple-silicon
		resetAdHocDarwinSignature:
			context.electronPlatformName === "darwin" && context.arch === Arch.arm64,

		[FuseV1Options.RunAsNode]: false,
		[FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
		[FuseV1Options.GrantFileProtocolExtraPrivileges]: false,
		[FuseV1Options.OnlyLoadAppFromAsar]: true,
		[FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
		[FuseV1Options.EnableNodeCliInspectArguments]: false,

		// high effort to set up correctly - see:
		// - https://github.com/electron/electron/blob/main/docs/tutorial/fuses.md#loadbrowserprocessspecificv8snapshot
		// - https://github.com/electron-userland/electron-builder/issues/8797
		[FuseV1Options.LoadBrowserProcessSpecificV8Snapshot]: false,

		// will trigger a permission dialog for safe storage / keychain access
		// on macOS at app start
		[FuseV1Options.EnableCookieEncryption]: false,
	});
}

export default async function afterPack(context: AfterPackContext) {
	// https://github.com/electron-userland/electron-builder/issues/6365#issuecomment-1191747089
	if (
		context.electronPlatformName !== "darwin" ||
		context.arch === Arch.universal
	) {
		await applyFuses(context);
	}
}
