import { createGlobalStyles } from "solid-styled-components";

const GlobalStyles = () => {
	const Styles = createGlobalStyles`
		html {
			box-sizing: border-box;
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
			inline-size: 100vw;
			block-size: 100vh;
		}
	`;

	return <Styles />;
};

export default GlobalStyles;
