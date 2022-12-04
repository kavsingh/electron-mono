import { styled } from "solid-styled-components";

const StatusBadge = styled.div`
	padding: ${(props) => props.theme?.spacing.relative[0]};
	background-color: ${(props) => props.theme?.colors.text[400]};
	color: ${(props) => props.theme?.colors.surface[0]};
	border-radius: ${(props) => props.theme?.radius.fixed[0]};
`;

export default StatusBadge;
