import type { Configuration } from "electron-builder";

const config: Configuration = {
	appId: "com.app.dev",
	productName: "App",
	directories: {
		buildResources: "build",
	},
	files: ["out/**"],
	asar: true,
	asarUnpack: "**/*.{node,dll}",
	afterSign: "build/after-sign.cjs",
	win: {
		executableName: "App",
	},
	nsis: {
		artifactName: "${name}-${version}-setup.${ext}",
		shortcutName: "${productName}",
		uninstallDisplayName: "${productName}",
		createDesktopShortcut: "always",
	},
	mac: {
		target: { target: "default", arch: ["universal"] },
		type: "distribution",
		hardenedRuntime: true,
		entitlementsInherit: "build/entitlements.mac.plist",
		extendInfo: [
			"NSCameraUsageDescription: Application requests access to the device's camera.",
			"NSMicrophoneUsageDescription: Application requests access to the device's microphone.",
			"NSDocumentsFolderUsageDescription: Application requests access to the user's Documents folder.",
			"NSDownloadsFolderUsageDescription: Application requests access to the user's Downloads folder.",
		],
	},
	dmg: {
		artifactName: "${name}-${version}-${arch}.${ext}",
	},
	linux: {
		target: ["AppImage", "snap", "deb"],
		maintainer: "electronjs.org",
		category: "Utility",
	},
	appImage: {
		artifactName: "${name}-${version}.${ext}",
	},
	npmRebuild: false,
	publish: {
		provider: "generic",
		url: "https://example.com/auto-updates",
	},
};

export default config;
