import type { ParentProps } from "solid-js";

function PageMain(props: ParentProps) {
	return <main class="mx-auto p-4 text-center">{props.children}</main>;
}

function PageHeader(props: ParentProps) {
	return (
		<header>
			<h1 class="my-16 text-6xl font-thin uppercase text-sky-700">
				{props.children}
			</h1>
		</header>
	);
}

function PageContent(props: ParentProps) {
	return (
		<section>
			{props.children}
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
		</section>
	);
}

export default { Main: PageMain, Header: PageHeader, Content: PageContent };
