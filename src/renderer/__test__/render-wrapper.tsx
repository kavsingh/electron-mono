import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import AppThemeProvider from "../design-system/app-theme-provider";

import type { FC, ReactNode } from "react";

export const setupRenderWrapper = () => {
	const user = userEvent.setup();
	const Wrapper: FC<WrapperProps> = ({ route = "/", children }) => (
		<AppThemeProvider>
			<MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
		</AppThemeProvider>
	);

	return { user, Wrapper };
};

interface WrapperProps {
	children: ReactNode;
	route?: string;
}
