import { UserTypes } from '@/types';
import { IndicatorElement } from '../../../types/Application';

export type dynamicItem = {
  value: string;
  label: string;
};

export type RoleUsers = {
  [Property in UserTypes.UserRoleTypes]: UserTypes.User['objectId'][];
};

export type Role = {
  value: string;
  type: string;
  label: string;
  color: string;
  users: { objectId: string; username: string }[];
};

export type ContextValues = {
  refetchFunction?: () => void;
  setRefetchFunction?: Dispatch<SetStateAction<() => void>>;
  createTicket: JSX.Element;
  createTask: JSX.Element;
  selectYear: JSX.Element;
  year: number;
  roles: Role[];
  roleUsers: RoleUsers;
};

export type YearOptions = { value: number; label: string }[];

export type SelectYearProps = {
  year: number;
  setYear: (value: number) => void;
};

export type IndicatorType = 'loading' | 'error' | 'success';

export type IndicatorElementWithType = IndicatorElement & {
  type: IndicatorType;
  timestamp: number;
};
