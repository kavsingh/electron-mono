import { A } from "@solidjs/router";
import { createSignal, onCleanup } from "solid-js";
import { styled } from "solid-styled-components";

import bridge from "~/renderer/bridge";

import Pulse from "./pulse";
import StatusBadge from "./status-badge";

import type { Component } from "solid-js";

const Masthead: Component = () => {
	const [status, setStatus] = createSignal("");
	const [timestamp, setTimestamp] = createSignal("");
	const unsubscribe = bridge.subscribeHealth((event) => {
		setStatus(event.status);
		setTimestamp(event.timestamp.toString());
	});

	onCleanup(unsubscribe);

	return (
		<Container>
			<Nav>
				<A href="/">System Info</A>
				<A href="/files">Files</A>
			</Nav>
			<Pulse trigger={timestamp}>
				<StatusBadge>{status()}</StatusBadge>
			</Pulse>
		</Container>
	);
};

export default Masthead;

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const Nav = styled.nav`
	display: flex;
	align-items: center;
	gap: ${(props) => props.theme?.spacing.fixed[0]};
`;
