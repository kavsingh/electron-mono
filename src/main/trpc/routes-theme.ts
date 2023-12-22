import { nativeTheme } from "electron";

import { themeSourceSchema } from "#common/lib/theme";

import { publicProcedure } from "./trpc-server";

import type { ThemeSource } from "#common/lib/theme";

export default function routesTheme() {
	return {
		themeSource: publicProcedure.query(
			(): ThemeSource => nativeTheme.themeSource,
		),

		setThemeSource: publicProcedure
			.input(themeSourceSchema)
			.mutation(({ input }) => {
				nativeTheme.themeSource = input;

				return nativeTheme.themeSource;
			}),
	} as const;
}
