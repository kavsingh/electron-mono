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
          inline-size: 100%;
          block-size: 100%;
          color: ${theme.colors.bodyText};
          background-color: ${theme.colors.background};
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
