import { Link, HashRouter, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/styled";

import { defaultTheme } from "./design-system/theme";
import GlobalStyles from "./design-system/global-styles";
import Home from "./pages/home";
import Devices from "./pages/devices";

import type { FCWithoutChildren } from "./types/component";

const App: FCWithoutChildren = () => (
  <HashRouter>
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles />
      <UIRoot>
        <Dragable />
        <nav>
          <Link to="/">Home</Link>
          <Link to="/devices">Devices</Link>
        </nav>
        <Switch>
          <Route path="/devices">
            <Devices />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </UIRoot>
    </ThemeProvider>
  </HashRouter>
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
