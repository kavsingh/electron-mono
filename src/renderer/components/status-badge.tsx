import styled from "@emotion/styled";

const StatusBadge = styled.div`
	padding: ${({ theme }) => theme.spacing.relative[0]};
	background-color: ${({ theme }) => theme.color.text[400]};
	color: ${({ theme }) => theme.color.surface[0]};
	border-radius: ${({ theme }) => theme.radius.fixed[0]};
`;

export default StatusBadge;
