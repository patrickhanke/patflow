import { ApplicationTypes } from '.';

export type UserRoleTypes = 'worker' | 'office' | 'admin';

export type UserRole = {
  objectId: string;
  name: strting;
  type: UserRoleTypes;
  color: 'primary' | 'secondary' | 'info' | 'warning';
  users: {
    results: Pick<User, 'objectId', 'username'>[];
  };
  roles: {
    results: UserRole[];
  };
};

export type UserTimeSettings = {
  hours: number;
  weekdays: number;
  pause: number;
  vacation: number;
  start: string;
  end: string;
};

export type User = {
  objectId: string;
  email: string;
  label: string;
  username: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  type: string;
  role: UserRole;
  is_worker: boolean;
  portrait: ApplicationTypes.Image;
  time_settings: UserTimeSettings;
  color: string;
};

export type UserDisplayData = Pick<
  User,
  | 'objectId'
  | 'last_name'
  | 'first_name'
  | 'email'
  | 'portrait'
  | 'color'
  | 'label'
>;

export type CreateUser = Pick<
  User,
  'last_name' | 'first_name' | 'email' | 'portrait'
> & { password: string; repeat_password: string; role: string };
