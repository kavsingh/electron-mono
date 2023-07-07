/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/renderer/index.html", "./src/renderer/**/*.tsx"],
	darkMode: "class",
	theme: {
		extend: {
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
