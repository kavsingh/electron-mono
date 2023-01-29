import { Show, For, createResource, onCleanup } from "solid-js";
import { styled } from "solid-styled-components";

import { measuredAsyncFn } from "~/common/measure";
import { getTRPCClient } from "~/renderer/trpc/client";

import type { Component } from "solid-js";

const SystemInfoList: Component = () => {
	const [infoResource, { mutate }] = createResource(getSystemInfo);
	const subscription = getTRPCClient().heartbeat.subscribe(undefined, {
		onData: mutate,
	});

	onCleanup(() => subscription.unsubscribe());

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

const getSystemInfo = measuredAsyncFn("getSystemInfo", () =>
	getTRPCClient().systemInfo.query(),
);

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
