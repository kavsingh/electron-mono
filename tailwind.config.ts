import containerQueriesPlugin from "@tailwindcss/container-queries";

import type { Config } from "tailwindcss";

export default {
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
	plugins: [
		// work around exactOptionalProperties
		containerQueriesPlugin as StripUndefined<typeof containerQueriesPlugin>,
	],
} satisfies Config;
