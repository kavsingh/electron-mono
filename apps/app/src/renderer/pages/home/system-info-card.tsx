import { useQuery } from "@tanstack/solid-query";
import { createMemo, Show } from "solid-js";

import CustomError from "#common/errors/custom-error";
import Card from "#renderer/components/card";
import InfoList from "#renderer/components/info-list";
import { tipc } from "#renderer/tipc";

export default function SystemInfoCard() {
	const infoQuery = useQuery(() => ({
		queryKey: ["systemInfo"],
		queryFn: () => tipc.getSystemInfo.invoke(),
	}));

	const errorMessage = createMemo(() => {
		if (!infoQuery.error) return undefined;

		return infoQuery.error instanceof CustomError
			? `${infoQuery.error.code}: ${infoQuery.error.message}`
			: "unknown error";
	});

	return (
		<Card.Root>
			<Card.Header>
				<Card.Title>System info</Card.Title>
			</Card.Header>
			<Card.Content>
				<Show when={infoQuery.data} fallback={<>loading...</>} keyed>
					{(info) => (
						<InfoList.Root>
							<InfoList.Entry>
								<InfoList.Label>os</InfoList.Label>
								<InfoList.Value>
									{info.osName} {info.osVersion}
								</InfoList.Value>
							</InfoList.Entry>
							<InfoList.Entry>
								<InfoList.Label>arch</InfoList.Label>
								<InfoList.Value>{info.osArch}</InfoList.Value>
							</InfoList.Entry>
						</InfoList.Root>
					)}
				</Show>
				<Show when={errorMessage()} keyed>
					{(message) => {
						return (
							<div class="rounded-sm bg-red-600 p-4 text-white">{message}</div>
						);
					}}
				</Show>
			</Card.Content>
		</Card.Root>
	);
}
