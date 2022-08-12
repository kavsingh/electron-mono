import { Global, css, useTheme } from "@emotion/react";

import type { FC } from "react";

const GlobalStyles: FC = () => {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        html {
          box-sizing: border-box;
          font-size: 16px;
          color: ${theme.color.text[400]};
          background-color: ${theme.color.surface[0]};
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

        body {
          inline-size: 100vw;
          block-size: 100vh;
        }

        #app-root {
          inline-size: 100%;
          block-size: 100%;
        }
      `}
    />
  );
};

export default GlobalStyles;
