import * as Types from '../graphql/__generated__/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type SystemInfoQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type SystemInfoQuery = { __typename?: 'Query', systemInfo: { __typename?: 'SystemInfo', osName: string, osVersion: string, osArch: string, memAvailable: bigint, memTotal: bigint } };


export const SystemInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SystemInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"systemInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"osName"}},{"kind":"Field","name":{"kind":"Name","value":"osVersion"}},{"kind":"Field","name":{"kind":"Name","value":"osArch"}},{"kind":"Field","name":{"kind":"Name","value":"memAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"memTotal"}}]}}]}}]} as unknown as DocumentNode<SystemInfoQuery, SystemInfoQueryVariables>;