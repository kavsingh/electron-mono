import { nativeTheme } from "electron";

import { themeSourceSchema } from "#common/lib/theme.ts";

import { publicProcedure } from "./trpc-server.ts";

import type { ThemeSource } from "#common/lib/theme.ts";

export function routesTheme() {
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
