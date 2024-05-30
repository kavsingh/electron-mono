import { useQuery } from "@tanstack/react-query";

import Card from "#renderer/components/card";
import InfoList from "#renderer/components/info-list";
import { trpc } from "#renderer/trpc";

export default function SystemInfoCard() {
	const { data: info } = useQuery({
		queryKey: ["systemInfo"],
		queryFn: () => trpc.systemInfo.query(),
	});

	return (
		<Card.Root>
			<Card.Header>
				<Card.Title>System info</Card.Title>
			</Card.Header>
			<Card.Content>
				{info ? (
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
				) : (
					<>loading...</>
				)}
			</Card.Content>
		</Card.Root>
	);
}
