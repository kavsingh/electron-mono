export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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
