import { Global, css } from "@emotion/react";

import type { FCWithoutChildren } from "@/renderer/types/component";

const GlobalStyle: FCWithoutChildren = () => (
  <Global
    styles={css`
      html {
        box-sizing: border-box;
        font-size: 16px;
      }

      *,
      *::before,
      *::after {
        box-sizing: inherit;
      }

      html,
      body {
        margin: 0;
        padding: 0;
      }

      #app-root {
        width: 100vw;
        height: 100vh;
        -webkit-overflow-scrolling: touch;
      }
    `}
  />
);

export default GlobalStyle;
