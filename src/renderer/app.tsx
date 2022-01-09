import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";

import { defaultTheme } from "./design-system/theme";
import GlobalStyles from "./design-system/global-styles";
import Home from "./pages/home";
import Devices from "./pages/devices";
import Files from "./pages/files";
import Masthead from "./components/masthead";

import type { VoidFunctionComponent } from "react";

const App: VoidFunctionComponent = () => (
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
);

export default App;

const UIRoot = styled.div`
  min-height: 100%;
  padding: 2em 1em 1em;
  color: ${({ theme }) => theme.colors.bodyText};
  font-family: ${({ theme }) => theme.fonts.bodyText};
  background-color: ${({ theme }) => theme.colors.background};
`;

const Dragable = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  height: 2em;
  -webkit-app-region: drag;
`;
