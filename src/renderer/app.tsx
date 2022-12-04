import { Router, hashIntegration, Route, Routes } from "@solidjs/router";
import { styled } from "solid-styled-components";

import Masthead from "./components/masthead";
import Files from "./pages/files";
import SystemInfo from "./pages/system-info";
import AppThemeProvider from "./style/app-theme-provider";
import GlobalStyles from "./style/global-styles";

import type { Component } from "solid-js";

const App: Component = () => (
	<Router source={hashIntegration()}>
		<AppThemeProvider>
			<GlobalStyles />
			<UIRoot>
				<Dragable />
				<Masthead />
				<Routes>
					<Route path="/" element={<SystemInfo />} />
					<Route path="/files" element={<Files />} />
				</Routes>
			</UIRoot>
		</AppThemeProvider>
	</Router>
);

export default App;

const UIRoot = styled.div`
	min-block-size: 100%;
	padding-block: 2em;
	padding-inline: 1em;
	font: 16px/1.3 ${(props) => props.theme?.fonts.body};
	color: ${(props) => props.theme?.colors.text[400]};
	background-color: ${(props) => props.theme?.colors.surface[0]};
`;

const Dragable = styled.div`
	position: fixed;
	block-size: 2em;
	inset-inline: 0;
	inset-block-start: 0;
	z-index: 1;
	-webkit-app-region: drag;
`;
