import { createSignal } from "solid-js";

export default function Counter() {
	const [count, setCount] = createSignal(0);

	return (
		<button
			class="w-[200px] rounded-full bg-neutral-100 px-8 py-4 dark:bg-neutral-950"
			onClick={() => setCount(count() + 1)}
		>
			Clicks: {count()}
		</button>
	);
}
