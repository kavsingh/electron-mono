import type { PropsWithChildren } from "react";

export function PageHeader(props: PropsWithChildren) {
	return (
		<header className="sticky top-0 bg-background/50 p-4 pt-8 backdrop-blur-md">
			<h2 className="text-3xl font-semibold leading-none">{props.children}</h2>
		</header>
	);
}

export function PageContent(props: PropsWithChildren) {
	return <main className="p-4">{props.children}</main>;
}

export default {
	Header: PageHeader,
	Content: PageContent,
};
