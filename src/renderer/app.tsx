import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";
import { StrictMode } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Masthead from "./components/masthead";
import GlobalStyles from "./design-system/global-styles";
import { defaultTheme } from "./design-system/theme";
import Files from "./pages/files";
import UsbDevices from "./pages/usb-devices";

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
            <Route path="/" element={<UsbDevices />} />
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
  color: ${({ theme }) => theme.color.text[400]};
  font-family: ${({ theme }) => theme.font.body};
  background-color: ${({ theme }) => theme.color.surface[0]};
`;

const Dragable = styled.div`
  position: fixed;
  block-size: 2em;
  inset-inline: 0;
  inset-block-start: 0;
  z-index: 1;
  -webkit-app-region: drag;
`;
