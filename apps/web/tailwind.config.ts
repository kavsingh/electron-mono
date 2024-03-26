import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				sans: [
					"Gordita",
					"Roboto",
					"Oxygen",
					"Ubuntu",
					"Cantarell",
					"Open Sans",
					"Helvetica Neue",
					"sans-serif",
				],
			},
		},
	},
} satisfies Config;
