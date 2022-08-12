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
							contentSecurityPolicy:
								"default-src 'none'; script-src 'self'; img-src 'self'; style-src 'self'",
							devContentSecurityPolicy:
								"default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:",
							preload: {
								js: "./src/preload.ts",
							},
						},
					],
				},
			},
		],
		["@electron-forge/plugin-auto-unpack-natives"],
	],
};
