import { User } from '@types';

export type UserLoggedInHandlerFunction = () => Promise<{
  loggedIn: boolean;
  user: User | null;
  token: string | null;
}>;
