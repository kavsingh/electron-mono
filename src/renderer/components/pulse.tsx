import { createEffect, createSignal, mergeProps, onCleanup } from "solid-js";

import type { Accessor, ParentComponent, JSX } from "solid-js";

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
		<div
			{...props}
			style={{ "animation-duration": `${props.durationMs}ms` }}
			class="opacity-0"
			classList={{
				...props.classList,
				"animate-[pulseOut_ease-out_forwards]": isActive(),
			}}
		>
			{props.children}
		</div>
	);
};

export default Pulse;

type Props = {
	durationMs?: number;
	trigger?: Accessor<unknown>;
} & JSX.CustomAttributes<HTMLDivElement>;
