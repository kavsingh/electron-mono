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

export type ThemeSource = z.infer<typeof themeSourceSchema>;
