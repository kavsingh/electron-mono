import { useGetProductCategories } from "~/renderer/services/native-api";

import type { FC } from "react";

const NativeApi: FC = () => {
	const { data, isLoading } = useGetProductCategories({});

	if (isLoading) return <>Loading...</>;

	return (
		<div>
			<h2>Native Api</h2>
			<h3>Categories</h3>
			{data?.response_body?.categories?.map((cat) => (
				<div key={cat.id}>{cat.name}</div>
			))}
		</div>
	);
};

export default NativeApi;
