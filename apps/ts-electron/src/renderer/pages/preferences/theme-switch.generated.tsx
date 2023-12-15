import * as Types from '../../graphql/__generated__/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type ThemeSourceQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ThemeSourceQuery = { __typename?: 'Query', themeSource: Types.ThemeSource };

export type SetThemeSourceMutationVariables = Types.Exact<{
  input: Types.ThemeSource;
}>;


export type SetThemeSourceMutation = { __typename?: 'Mutation', setThemeSource: Types.ThemeSource };


export const ThemeSourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ThemeSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"themeSource"}}]}}]} as unknown as DocumentNode<ThemeSourceQuery, ThemeSourceQueryVariables>;
export const SetThemeSourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetThemeSource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ThemeSource"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setThemeSource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<SetThemeSourceMutation, SetThemeSourceMutationVariables>;