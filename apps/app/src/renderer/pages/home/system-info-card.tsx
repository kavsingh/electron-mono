import { useQuery } from "@tanstack/solid-query";
import { Show } from "solid-js";

import { Card } from "#renderer/components/card";
import { InfoList } from "#renderer/components/info-list";
import { trpc } from "#renderer/trpc";

export function SystemInfoCard() {
	const infoQuery = useQuery(() => ({
		queryKey: ["systemInfo"],
		queryFn: () => trpc.systemInfo.query(),
	}));

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
			</Card.Content>
		</Card.Root>
	);
}
