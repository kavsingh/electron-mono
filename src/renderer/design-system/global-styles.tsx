import { Global, css, useTheme } from "@emotion/react";

import type { FCWithoutChildren } from "~/renderer/types/component";

const GlobalStyles: FCWithoutChildren = () => {
  const theme = useTheme();

  return (
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
          color: ${theme.colors.bodyText};
          background-color: ${theme.colors.background};
        }

        #app-root {
          width: 100vw;
          height: 100vh;
          -webkit-overflow-scrolling: touch;
        }
      `}
    />
  );
};

export default GlobalStyles;
