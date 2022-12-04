import { Show, For, createResource, onCleanup } from "solid-js";
import { styled } from "solid-styled-components";

import { measuredAsyncFn } from "~/common/measure";
import bridge from "~/renderer/bridge";

import type { Component } from "solid-js";

const SystemInfoList: Component = () => {
	const [infoResource, { mutate }] = createResource(getSystemInfo);
	const unsubscribe = bridge.subscribeSystemInfo((message) => {
		mutate(message);
	});

	onCleanup(unsubscribe);

	return (
		<Show when={infoResource()} fallback={<>Loading...</>} keyed>
			{(info) => (
				<Container>
					<For each={Object.entries(info)}>
						{([key, val]) => (
							<InfoItem>
								<span>{key}</span>
								<span>{String(val)}</span>
							</InfoItem>
						)}
					</For>
				</Container>
			)}
		</Show>
	);
};

export default SystemInfoList;

const getSystemInfo = measuredAsyncFn("getSystemInfo", bridge.getSystemInfo);

const Container = styled.ul`
	display: flex;
	flex-direction: column;
	padding: 0;
	margin: 0;
	gap: ${(props) => props.theme?.spacing.fixed[1]};
	list-style-type: none;
`;

const InfoItem = styled.li`
	display: flex;
	flex-direction: column;
	gap: ${(props) => props.theme?.spacing.fixed[0]};

	&:not(:last-of-type) {
		padding-block-end: ${(props) => props.theme?.spacing.fixed[1]};
		border-block-end: 1px solid ${(props) => props.theme?.colors.text[100]};
	}
`;
