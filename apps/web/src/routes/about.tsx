import Counter from "#components/counter";
import Page from "#layouts/page";

export default function About() {
	return (
		<Page.Main>
			<Page.Header>About Page</Page.Header>
			<Page.Content>
				<Counter />
			</Page.Content>
		</Page.Main>
	);
}
