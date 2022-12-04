import "solid-styled-components";
import type { Theme as AppTheme } from "~/renderer/design-system/theme";

declare module "solid-styled-components" {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	export interface DefaultTheme extends AppTheme {}
}
