module.exports = {
	packagerConfig: {
		asar: true,
	},
	makers: [
		{
			name: "@electron-forge/maker-dmg",
			platforms: ["darwin", "darwin-arm64"],
		},
		{
			name: "@electron-forge/maker-squirrel",
			config: { name: "TSElectron" },
			platforms: ["win32"],
		},
	],
	plugins: [
		{
			name: "@electron-forge/plugin-webpack",
			config: {
				mainConfig: "./webpack.main.config.js",
				renderer: {
					config: "./webpack.renderer.config.js",
					entryPoints: [
						{
							name: "main_window",
							js: "./src/renderer/index.tsx",
							html: "./src/renderer/index.html",
							preload: { js: "./src/preload.ts" },
						},
					],
				},
				devContentSecurityPolicy:
					"default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:",
			},
		},
		{ name: "@electron-forge/plugin-auto-unpack-natives", config: {} },
	],
};
