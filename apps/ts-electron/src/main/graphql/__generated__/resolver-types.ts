import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: bigint; output: bigint; }
};

export type ElectronFileFilter = {
  extensions: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type ElectronOpenDialogOptions = {
  buttonLabel?: InputMaybe<Scalars['String']['input']>;
  defaultPath?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<Array<ElectronFileFilter>>;
  message?: InputMaybe<Scalars['String']['input']>;
  properties?: InputMaybe<Array<ElectronOpenDialogProperty>>;
  securityScopedBookmarks?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export enum ElectronOpenDialogProperty {
  CreateDirectory = 'createDirectory',
  DontAddToRecent = 'dontAddToRecent',
  MultiSelections = 'multiSelections',
  NoResolveAliases = 'noResolveAliases',
  OpenDirectory = 'openDirectory',
  OpenFile = 'openFile',
  PromptToCreate = 'promptToCreate',
  ShowHiddenFiles = 'showHiddenFiles',
  TreatPackageAsDirectory = 'treatPackageAsDirectory'
}

export type ElectronOpenDialogReturnValue = {
  __typename?: 'ElectronOpenDialogReturnValue';
  bookmarks?: Maybe<Array<Scalars['String']['output']>>;
  canceled: Scalars['Boolean']['output'];
  filePaths: Array<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  setThemeSource: ThemeSource;
  showOpenDialog: ElectronOpenDialogReturnValue;
};


export type MutationSetThemeSourceArgs = {
  input: ThemeSource;
};


export type MutationShowOpenDialogArgs = {
  options: ElectronOpenDialogOptions;
};

export type Query = {
  __typename?: 'Query';
  systemInfo: SystemInfo;
  themeSource: ThemeSource;
};

export type SystemInfo = {
  __typename?: 'SystemInfo';
  memAvailable: Scalars['BigInt']['output'];
  memTotal: Scalars['BigInt']['output'];
  osArch: Scalars['String']['output'];
  osName: Scalars['String']['output'];
  osVersion: Scalars['String']['output'];
};

export enum ThemeSource {
  Dark = 'dark',
  Light = 'light',
  System = 'system'
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ElectronFileFilter: ElectronFileFilter;
  ElectronOpenDialogOptions: ElectronOpenDialogOptions;
  ElectronOpenDialogProperty: ElectronOpenDialogProperty;
  ElectronOpenDialogReturnValue: ResolverTypeWrapper<ElectronOpenDialogReturnValue>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SystemInfo: ResolverTypeWrapper<SystemInfo>;
  ThemeSource: ThemeSource;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  BigInt: Scalars['BigInt']['output'];
  Boolean: Scalars['Boolean']['output'];
  ElectronFileFilter: ElectronFileFilter;
  ElectronOpenDialogOptions: ElectronOpenDialogOptions;
  ElectronOpenDialogReturnValue: ElectronOpenDialogReturnValue;
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  SystemInfo: SystemInfo;
}>;

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type ElectronOpenDialogReturnValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['ElectronOpenDialogReturnValue'] = ResolversParentTypes['ElectronOpenDialogReturnValue']> = ResolversObject<{
  bookmarks?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  canceled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  filePaths?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  setThemeSource?: Resolver<ResolversTypes['ThemeSource'], ParentType, ContextType, RequireFields<MutationSetThemeSourceArgs, 'input'>>;
  showOpenDialog?: Resolver<ResolversTypes['ElectronOpenDialogReturnValue'], ParentType, ContextType, RequireFields<MutationShowOpenDialogArgs, 'options'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  systemInfo?: Resolver<ResolversTypes['SystemInfo'], ParentType, ContextType>;
  themeSource?: Resolver<ResolversTypes['ThemeSource'], ParentType, ContextType>;
}>;

export type SystemInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['SystemInfo'] = ResolversParentTypes['SystemInfo']> = ResolversObject<{
  memAvailable?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  memTotal?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  osArch?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  osName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  osVersion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  BigInt?: GraphQLScalarType;
  ElectronOpenDialogReturnValue?: ElectronOpenDialogReturnValueResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SystemInfo?: SystemInfoResolvers<ContextType>;
}>;

