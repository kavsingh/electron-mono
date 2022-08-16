// import { useEffect } from "react";

import { useGetProductCategories } from "~/renderer/api/napi";

import type { FC } from "react";

const NativeApi: FC = () => {
	const { data, isLoading } = useGetProductCategories({});

	// useEffect(() => {
	// 	napiClient.get("v1/products/categories").then(console.log);
	// }, []);

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
