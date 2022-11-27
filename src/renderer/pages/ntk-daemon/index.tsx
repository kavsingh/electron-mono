import styled from "@emotion/styled";

import Products from "./products";
import StatusIndicator from "./status-indicator";
import Version from "./version";

export default function NTKDaemon() {
	return (
		<div>
			<Header>
				<h2>NTK Daemon</h2>
				<StatusIndicator />
			</Header>
			<Version />
			<Products />
		</div>
	);
}

const Header = styled.header`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;
