import containerQueriesPlugin from "@tailwindcss/container-queries";

import type { Config } from "tailwindcss";

export default {
	content: ["./src/renderer/index.html", "./src/renderer/**/*.tsx"],
	darkMode: "class",
	plugins: [
		// work around exactOptionalProperties
		containerQueriesPlugin as StripUndefined<typeof containerQueriesPlugin>,
	],
} satisfies Config;
