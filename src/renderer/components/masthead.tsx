import { A } from "@solidjs/router";
import { createSignal, onCleanup } from "solid-js";
import { styled } from "solid-styled-components";

import Pulse from "./pulse";
import StatusBadge from "./status-badge";
import { getTRPCClient } from "../trpc/client";

import type { Component } from "solid-js";

const Masthead: Component = () => {
	const [timestamp, setTimestamp] = createSignal("");
	const subscription = getTRPCClient().heartbeat.subscribe(undefined, {
		onData: () => {
			setTimestamp(String(Date.now()));
		},
	});

	onCleanup(() => subscription.unsubscribe());

	return (
		<Container>
			<Nav>
				<A href="/">System Info</A>
				<A href="/files">Files</A>
			</Nav>
			<Pulse trigger={timestamp}>
				<StatusBadge>{"OK"}</StatusBadge>
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
