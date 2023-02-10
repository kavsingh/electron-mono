import { createEffect, createSignal, mergeProps, onCleanup } from "solid-js";
import { keyframes, css, styled } from "solid-styled-components";

import type { Accessor, ParentComponent, ComponentProps } from "solid-js";

const Pulse: ParentComponent<Props> = (_props) => {
	const props = mergeProps({ durationMs: 1200 }, _props);
	const [isActive, setIsActive] = createSignal(false);
	let fadeTimeout: NodeJS.Timeout;

	const triggerPulse = () => {
		setIsActive(true);
		fadeTimeout = setTimeout(() => setIsActive(false), props.durationMs);
	};

	createEffect(() => {
		if (props.trigger?.()) triggerPulse();
	});

	onCleanup(() => {
		clearTimeout(fadeTimeout);
	});

	return (
		<Container
			{...props}
			classList={{
				...props.classList,
				[getPulseStyles(props.durationMs)]: isActive(),
			}}
		>
			{props.children}
		</Container>
	);
};

export default Pulse;

const Container = styled.div`
	opacity: 0;
`;

const pulse = keyframes`
  0% {
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`;

const getPulseStyles = (durationMs: number) => css`
	animation: ${pulse} ${String(durationMs)}ms ease-out forwards;
`;

type Props = {
	durationMs?: number;
	trigger?: Accessor<unknown>;
} & ComponentProps<typeof Container>;
