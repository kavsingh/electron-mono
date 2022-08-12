import styled from "@emotion/styled";
import { useEffect, useState } from "react";

import bridge from "~/renderer/bridge";

import type { FC } from "react";

const SystemInfoList: FC = () => {
	const [info, setInfo] = useState<AsyncResult<typeof bridge.getSystemInfo>>();

	useEffect(() => {
		void bridge.getSystemInfo().then(setInfo);

		return bridge.subscribeSystemInfo((message) => {
			setInfo(message);
		});
	}, []);

	return info ? (
		<Container>
			{Object.entries(info).map(([key, val]) => (
				<InfoItem key={key}>
					<span>{key}</span>
					<span>{String(val)}</span>
				</InfoItem>
			))}
		</Container>
	) : (
		<>Loading...</>
	);
};

export default SystemInfoList;

const Container = styled.ul`
	display: flex;
	flex-direction: column;
	padding: 0;
	margin: 0;
	gap: ${({ theme }) => theme.spacing.fixed[1]};
	list-style-type: none;
`;

const InfoItem = styled.li`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing.fixed[0]};

	&:not(:last-of-type) {
		padding-block-end: ${({ theme }) => theme.spacing.fixed[1]};
		border-block-end: 1px solid ${({ theme }) => theme.color.text[100]};
	}
`;
