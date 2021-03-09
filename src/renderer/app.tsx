import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";

import { defaultTheme } from "./design-system/theme";
import GlobalStyle from "./design-system/global-style";
import DeviceList from "./device-list";
import type { FCWithoutChildren } from "./types/component";

const App: FCWithoutChildren = () => (
  <ThemeProvider theme={defaultTheme}>
    <GlobalStyle />
    <UIRoot>
      <DeviceList />
    </UIRoot>
  </ThemeProvider>
);

export default App;

const UIRoot = styled.div`
  min-height: 100%;
  padding: 1em;
  color: ${({ theme }) => theme.colors.bodyText};
  font-family: ${({ theme }) => theme.fonts.bodyText};
  background-color: ${({ theme }) => theme.colors.background};
`;
