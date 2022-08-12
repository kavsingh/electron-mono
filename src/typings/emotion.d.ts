import type { Theme as AppTheme } from "~/renderer/design-system/theme";

declare module "@emotion/react" {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	export interface Theme extends AppTheme {}
}
