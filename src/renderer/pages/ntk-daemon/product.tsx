import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

import { fetchKnownProducts } from "~/renderer/services/ntk-daemon";
import { NtkDaemonQueryKey } from "~/renderer/services/ntk-daemon/constants";

export default memo(function Product({ upid }: { upid: string }) {
	const { data: product } = useQuery({
		cacheTime: Infinity,
		queryKey: [NtkDaemonQueryKey.KnownProducts],
		queryFn: fetchKnownProducts,
		select: (data) => data.find((item) => item.upid === upid),
	});

	return (
		<div>
			<div>{product?.title}</div>
			<div>{product?.installed ? "Installed" : "Not Installed"}</div>
		</div>
	);
});
