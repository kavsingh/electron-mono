import "solid-styled-components";
import type { Theme as AppTheme } from "~/renderer/style/theme";

declare module "solid-styled-components" {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions
	export interface DefaultTheme extends AppTheme {}
}
