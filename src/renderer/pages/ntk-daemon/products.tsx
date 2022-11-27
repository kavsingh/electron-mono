import { useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchKnownProducts } from "~/renderer/services/ntk-daemon";
import { NtkDaemonQueryKey } from "~/renderer/services/ntk-daemon/constants";

import Product from "./product";

export default function Products() {
	const queryClient = useQueryClient();
	const { data: upids } = useQuery({
		staleTime: Infinity,
		refetchOnMount: false,
		queryKey: [NtkDaemonQueryKey.KnownProducts],
		queryFn: fetchKnownProducts,
		select: (data) => data.map(({ upid }) => upid),
	});

	const handleRefreshClick = () => {
		void queryClient.invalidateQueries({
			queryKey: [NtkDaemonQueryKey.KnownProducts],
		});
	};

	return (
		<div>
			<button onClick={handleRefreshClick}>Refresh</button>
			<div>
				{upids?.map((upid) => (
					<Product upid={upid} key={upid} />
				))}
			</div>
		</div>
	);
}
