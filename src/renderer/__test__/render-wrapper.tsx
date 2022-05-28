import { MemoryRouter } from "react-router-dom";

import AppThemeProvider from "../design-system/app-theme-provider";

import type { FC, ReactNode } from "react";

export const setupRenderWrapper = () => {
  const Wrapper: FC<WrapperProps> = ({ route = "/", children }) => (
    <AppThemeProvider>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </AppThemeProvider>
  );

  return { Wrapper };
};

interface WrapperProps {
  children: ReactNode;
  route?: string;
}
