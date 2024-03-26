import { A } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";

import Counter from "#components/counter";

const HostInfo = clientOnly(() => import("#components/host-info"));

export default function Home() {
	return (
		<main class="mx-auto p-4 text-center text-gray-700">
			<h1 class="my-16 text-6xl font-thin uppercase text-sky-700">
				Hosted Page
			</h1>
			<Counter />
			<HostInfo />
			<p class="mt-8">
				Visit{" "}
				<a
					href="https://solidjs.com"
					target="_blank"
					class="text-sky-600 hover:underline"
				>
					solidjs.com
				</a>{" "}
				to learn how to build Solid apps.
			</p>
			<p class="my-4">
				<span>Home</span>
				{" - "}
				<A href="/about" class="text-sky-600 hover:underline">
					About Page
				</A>{" "}
			</p>
		</main>
	);
}
