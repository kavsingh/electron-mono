import { StrictMode } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";

import { defaultTheme } from "./design-system/theme";
import GlobalStyles from "./design-system/global-styles";
import Home from "./pages/home";
import Devices from "./pages/devices";
import Files from "./pages/files";
import Masthead from "./components/masthead";

import type { FC } from "react";

const App: FC = () => (
  <StrictMode>
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles />
      <HashRouter>
        <UIRoot>
          <Dragable />
          <Masthead />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/files" element={<Files />} />
          </Routes>
        </UIRoot>
      </HashRouter>
    </ThemeProvider>
  </StrictMode>
);

export default App;

const UIRoot = styled.div`
  min-block-size: 100%;
  padding-block: 2em;
  padding-inline: 1em;
  color: ${({ theme }) => theme.colors.bodyText};
  font-family: ${({ theme }) => theme.fonts.bodyText};
  background-color: ${({ theme }) => theme.colors.background};
`;

const Dragable = styled.div`
  position: fixed;
  block-size: 2em;
  inset-inline: 0;
  inset-block-start: 0;
  z-index: 1;
  -webkit-app-region: drag;
`;
