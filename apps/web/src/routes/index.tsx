import { clientOnly } from "@solidjs/start";

import Counter from "#components/counter";
import Page from "#layouts/page";

const HostInfo = clientOnly(() => import("#components/host-info"));

export default function Home() {
	return (
		<Page.Main>
			<Page.Header>Home Page</Page.Header>
			<Page.Content>
				<div class="space-y-6">
					<Counter />
					<HostInfo />
				</div>
			</Page.Content>
		</Page.Main>
	);
}
