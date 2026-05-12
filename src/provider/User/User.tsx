import { useMemo } from 'react';
import userDataHandler from './userDataHandler';
import { User } from '@types';
import { UserLoggedInHandlerFunction } from './types';

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
    let userObject = null;

    const sessionToken = await userDataHandler('read', 'token');

    const httpHeaders = {
      'X-Parse-Session-Token': sessionToken || '',
      'X-Parse-Application-Id': process.env.SASHIDO_APP_ID || '',
      'X-Parse-REST-API-Key': process.env.SASHIDO_REST_KEY || ''
    };

    const headers = new Headers(httpHeaders);

    if (sessionToken) {
      await fetch(`${process.env.SASHIDO_API_URL}users/me`, {
        method: 'GET',
        headers
      })
        .then(response => response.json())
        .then(async actualData => {
          console.log({ actualData });
          const userData = await fetch(
            `${process.env.SASHIDO_API_URL}functions/get-user-data`,
            {
              method: 'POST',
              body: JSON.stringify({
                email: actualData.email
              }),
              headers
            }
          )
            .then(response => response.json())
            .catch(error => {
              console.error(error.message);
            });

          console.log('userData', userData);
          userObject = actualData;
          if (actualData.sessionToken === sessionToken) {
            loggedIn = true;
          }
        })
        .catch(error => {
          console.error(error.message);
          loggedIn = false;
        });
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
