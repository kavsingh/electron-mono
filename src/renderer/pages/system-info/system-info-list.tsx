import styled from "@emotion/styled";
import { useEffect, useState } from "react";

import { measuredAsyncFn } from "~/common/measure";
import bridge from "~/renderer/bridge";

import type { FC } from "react";

const SystemInfoList: FC = () => {
	const [info, setInfo] = useState<AsyncResult<typeof getSystemInfo>>();
	const [error, setError] = useState<Error | undefined>(undefined);

	useEffect(() => {
		void getSystemInfo()
			.then(setInfo)
			.catch((reason) => {
				setError(reason instanceof Error ? reason : new Error(String(reason)));
			});

		return bridge.subscribeSystemInfo((message) => {
			setInfo(message);
		});
	}, []);

	return info ? (
		<Container>
			{error ? error.message : null}
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

const getSystemInfo = measuredAsyncFn("getSystemInfo", bridge.getSystemInfo);

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
