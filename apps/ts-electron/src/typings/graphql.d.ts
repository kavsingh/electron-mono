declare module "*.gql" {
	import type { DocumentNode } from "graphql";

	const typeDefs: DocumentNode;

	export default typeDefs;
}
