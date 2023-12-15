import { makeExecutableSchema } from "@graphql-tools/schema";
import { dialog, nativeTheme } from "electron";
import { BigIntResolver } from "graphql-scalars";

import { getSystemInfo } from "#main/services/system-info";

import { ThemeSource } from "./__generated__/resolver-types";
import typeDefs from "./schema.gql";

import type {
	ElectronOpenDialogOptions,
	Resolvers,
} from "./__generated__/resolver-types";

const themeSourceToString = {
	[ThemeSource.System]: "system",
	[ThemeSource.Light]: "light",
	[ThemeSource.Dark]: "dark",
} as const;

const themeSourceToEnum = {
	system: ThemeSource.System,
	light: ThemeSource.Light,
	dark: ThemeSource.Dark,
} as const;

const resolvers: Resolvers = {
	BigInt: BigIntResolver,

	Query: {
		themeSource() {
			return themeSourceToEnum[nativeTheme.themeSource];
		},

		systemInfo() {
			return getSystemInfo();
		},
	},

	Mutation: {
		setThemeSource(input) {
			nativeTheme.themeSource = themeSourceToString[input as ThemeSource];

			return themeSourceToEnum[nativeTheme.themeSource];
		},

		showOpenDialog(options: ElectronOpenDialogOptions) {
			const optionEntries = Object.entries(options);
			// need to strip null / undefined
			const dialogOptions: Electron.OpenDialogOptions = Object.fromEntries(
				optionEntries.filter(([, val]) => {
					return typeof val !== "undefined" && val !== null;
				}),
			);

			return dialog.showOpenDialog(dialogOptions);
		},
	},
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
