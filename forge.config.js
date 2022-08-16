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
		[
			"@electron-forge/plugin-webpack",
			{
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
		],
		["@electron-forge/plugin-auto-unpack-natives"],
	],
};
