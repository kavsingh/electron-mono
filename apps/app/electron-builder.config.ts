import type { Configuration } from "electron-builder";

const config: Configuration = {
	appId: "com.app.dev",
	afterPack: "build/after-pack.ts",
	directories: {
		buildResources: "build",
	},
	files: ["out/**"],
	nsis: {
		artifactName: "${productName}-${version}-setup.${ext}",
		shortcutName: "${productName}",
		uninstallDisplayName: "${productName}",
		createDesktopShortcut: "always",
	},
	mac: {
		target: { target: "default", arch: ["universal"] },
		hardenedRuntime: true,
		entitlements: "build/entitlements.mac.plist",
		entitlementsInherit: "build/entitlements.mac.plist",
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
