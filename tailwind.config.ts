import containerQueriesPlugin from "@tailwindcss/container-queries";

import type { Config } from "tailwindcss";

export default {
	content: ["./src/renderer/index.html", "./src/renderer/**/*.tsx"],
	darkMode: "class",
	theme: {
		extend: {
			gridTemplateColumns: {
				"app-layout": "min-content 1fr",
			},
		},
	},
	plugins: [
		// work around exactOptionalProperties
		containerQueriesPlugin as StripUndefined<typeof containerQueriesPlugin>,
	],
} satisfies Config;
