import styled from "@emotion/styled";
import { Link } from "react-router-dom";

import type { FC } from "react";

const Masthead: FC = () => (
	<Container>
		<Nav>
			<Link to="/">System Info</Link>
			<Link to="/daemon">NTK Daemon</Link>
			<Link to="/files">Files</Link>
		</Nav>
	</Container>
);

export default Masthead;

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const Nav = styled.nav`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.fixed[0]};
`;
