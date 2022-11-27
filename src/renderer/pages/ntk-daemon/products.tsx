import { useQuery } from "@tanstack/react-query";

import { fetchKnownProducts } from "~/renderer/services/ntk-daemon";
import { NtkDaemonQueryKey } from "~/renderer/services/ntk-daemon/constants";

import Product from "./product";

export default function Products() {
	const { data: upids } = useQuery({
		queryKey: [NtkDaemonQueryKey.KnownProducts],
		queryFn: fetchKnownProducts,
		select: (data) => data.map(({ upid }) => upid),
	});

	return (
		<>
			{upids?.map((upid) => (
				<Product upid={upid} key={upid} />
			))}
		</>
	);
}
