import { UserTypes } from '.';
import { ObjectTypes, TaskTypes } from '../content';
import { paramsHandler } from '@repo/provider';
import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject
} from '@apollo/client';
import { Filter } from '@repo/types';

type type = 'find' | 'get';
type objectName = 'Person' | 'Module';
type fields = Array<string>;

type QueryProps = {
  type: type;
  objectName: string;
  fields: fields;
  constraints?: Filter[];
};

type ParamsHandlerProps = {
  projectId?: string;
  moduleId?: string;
  filters?: Filter[];
};

export type ParamsHandlerType = (
  T: ParamsHandlerProps
) => ReturnType<typeof paramsHandler>;

export type ApolloAppProviderProps = {
  appId: string;
  masterKey: string;
  children: React.ReactNode;
};

export type makeClientProps = (
  appId: string,
  masterKey: string
) => ApolloClient<NormalizedCacheObject>;

export type Params = {
  object_id: string;
  user_id: string;
  code: string;
};

export type Project = {
  createdAt: string;
  objectId: string;
  name: string;
  logo: {
    name: string;
    url: string;
  };
};

export type ErrorMessage = {
  id: string;
  key: string;
  message: string;
};

export type Document = {
  objectId: string;
  createdAt: string;
  file: {
    url;
    name;
  };
  created_by: UserTypes.User;
  task: TaskTypes.Task;
  object: ObjectTypes.Object;
  name: string;
  type: 'task' | 'object';
};

export type FilterOperator =
  | '_eq'
  | '_ne'
  | '_lt'
  | '_lte'
  | '_gt'
  | '_gte'
  | '_in'
  | '_nin'
  | '_regex';

export type Filter = {
  key: string;
  value: string | Array<string | number> | number | boolean;
  operator: FilterOperator;
  id?: string;
};

export type StateColors =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

export type DatabaseFile = { name: string; url: string };

export type Pointer = { __type: string; className: string; objectId: string };

export type Relation = { __op: string; objects: Array<Pointer> };

export type Comment = {
  userId: UserTypes.User['objectId'];
  username: string;
  createdAt: DateTypes.TDateISO;
  text: string;
  image: string;
};

export type UploadedFile = {
  file: {
    readonly name: string;
    readonly size: number;
    readonly type: string;
    slice: (start?: number, end?: number) => Blob;
  };
};

export type Image = string; // filePath to Image

export type IndicatorElement = {
  id: string;
  loading: string;
  error: string;
  success: string;
};

export type ApolloRefetch = () => Promise<ApolloQueryResult<any>>;

export type Refetch = () => Promise<void>;
