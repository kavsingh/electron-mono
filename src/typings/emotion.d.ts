import type { Theme as AppTheme } from "@/renderer/style/theme";

declare module "@emotion/react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends AppTheme {}
}
