import * as Types from '../graphql/__generated__/types';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type ShowOpenDialogMutationVariables = Types.Exact<{
  options: Types.ElectronOpenDialogOptions;
}>;


export type ShowOpenDialogMutation = { __typename?: 'Mutation', showOpenDialog: { __typename?: 'ElectronOpenDialogReturnValue', filePaths: Array<string> } };


export const ShowOpenDialogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ShowOpenDialog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ElectronOpenDialogOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"showOpenDialog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filePaths"}}]}}]}}]} as unknown as DocumentNode<ShowOpenDialogMutation, ShowOpenDialogMutationVariables>;