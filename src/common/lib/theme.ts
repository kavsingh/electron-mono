import { z } from "zod";

export const themeSourceSchema = z.union([
	z.literal("system"),
	z.literal("light"),
	z.literal("dark"),
]);

export const THEME_SOURCES = ["system", "light", "dark"] satisfies [
	ThemeSource,
	ThemeSource,
	ThemeSource,
];

export function isValidThemeSource(value: unknown): value is ThemeSource {
	return (
		typeof value === "string" && THEME_SOURCES.includes(value as ThemeSource)
	);
}

export type ThemeSource = z.infer<typeof themeSourceSchema>;
