import { useMemo } from 'react';
import { SASHIDO_API_URL, SASHIDO_APP_ID, SASHIDO_REST_KEY } from '@env';
import userDataHandler from './userDataHandler';
import { User } from '@types';
import { UserLoggedInHandlerFunction } from './types';
import { PATFLOW_PROJECT_ID } from '../constants/project';

type GetUserDataResult = {
  success?: boolean;
  user?: User | null;
  message?: string;
  type?: string;
};

const parseHeaders = (sessionToken?: string | null) =>
  new Headers({
    'X-Parse-Session-Token': sessionToken || '',
    'X-Parse-Application-Id': SASHIDO_APP_ID,
    'X-Parse-REST-API-Key': SASHIDO_REST_KEY,
    'Content-Type': 'application/json'
  });

const useUser = () => {
  const setApplicationUser = (
    key: 'token' | 'user' | 'installation_id',
    value: string
  ) => {
    userDataHandler('write', key, value);
  };

  const getUser = async () => {
    const userValue = await userDataHandler('read', 'user').then(
      value => value
    );

    const tokenValue = await userDataHandler('read', 'token').then(
      value => value
    );

    const installationIdValue = await userDataHandler(
      'read',
      'installation_id'
    ).then(value => value);

    return {
      user: userValue ? (JSON.parse(userValue as string) as User) : null,
      token: tokenValue as string,
      installationId: installationIdValue as string
    };
  };

  const userLoggedInHandler: UserLoggedInHandlerFunction = async () => {
    let loggedIn = false;
    let userObject: User | null = null;

    const sessionToken = await userDataHandler('read', 'token');
    const headers = parseHeaders(sessionToken as string | null);

    if (sessionToken) {
      try {
        const meResponse = await fetch(`${SASHIDO_API_URL}users/me`, {
          method: 'GET',
          headers
        });
        const actualData = await meResponse.json();

        if (!actualData?.objectId || actualData.error) {
          return {
            loggedIn: false,
            user: null,
            token: sessionToken
          };
        }

        const userDataResponse = await fetch(
          `${SASHIDO_API_URL}functions/get_user_data`,
          {
            method: 'POST',
            body: JSON.stringify({
              email: actualData.email,
              username: actualData.email,
              project_id: PATFLOW_PROJECT_ID
            }),
            headers
          }
        );
        const userData = (await userDataResponse.json()) as {
          result?: GetUserDataResult;
        };
        const userDataResult = userData?.result;

        if (userDataResult?.success && userDataResult.user) {
          userObject = userDataResult.user;
          await userDataHandler('write', 'user', JSON.stringify(userObject));
        } else {
          console.warn(
            'get_user_data failed, falling back to /users/me',
            userDataResult?.message || userDataResult?.type
          );
          userObject = actualData as User;
        }

        if (actualData.sessionToken === sessionToken) {
          loggedIn = true;
        }
      } catch (error) {
        console.error(
          error instanceof Error ? error.message : 'userLoggedInHandler failed'
        );
        loggedIn = false;
        userObject = null;
      }
    }

    return {
      loggedIn,
      user: userObject,
      token: sessionToken
    };
  };

  const returnValue = useMemo(() => {
    return {
      userLoggedInHandler,
      getUser,
      setUser: setApplicationUser
    };
  }, []);

  return returnValue;
};

export default useUser;
