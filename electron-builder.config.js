/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
	appId: "com.ts-electron.app",
	productName: "TSElectron",
	directories: {
		buildResources: "build",
	},
	files: ["out/**"],
	asarUnpack: "**/*.{node,dll}",
	afterSign: "build/notarize.js",
	win: {
		executableName: "ts-electron",
	},
	nsis: {
		artifactName: "${name}-${version}-setup.${ext}",
		shortcutName: "${productName}",
		uninstallDisplayName: "${productName}",
		createDesktopShortcut: "always",
	},
	mac: {
		entitlementsInherit: "build/entitlements.mac.plist",
		extendInfo: [
			"NSCameraUsageDescription: Application requests access to the device's camera.",
			"NSMicrophoneUsageDescription: Application requests access to the device's microphone.",
			"NSDocumentsFolderUsageDescription: Application requests access to the user's Documents folder.",
			"NSDownloadsFolderUsageDescription: Application requests access to the user's Downloads folder.",
		],
	},
	dmg: {
		artifactName: "${name}-${version}.${ext}",
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

module.exports = config;
