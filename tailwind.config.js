const { colors } = require("./tw-extends");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/renderer/index.html", "./src/renderer/**/*.tsx"],
	darkMode: "media",
	theme: {
		extend: {
			colors,
			keyframes: {
				"pulse-out": {
					"0%": { opacity: "0" },
					"10%": { opacity: "1" },
					"100%": { opacity: "0" },
				},
			},
		},
	},
	plugins: [require("@tailwindcss/container-queries")],
};
