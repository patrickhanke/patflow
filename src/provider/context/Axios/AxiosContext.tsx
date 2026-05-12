import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback
} from 'react';
import axios, { AxiosError, AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { userDataHandler } from '../../User';

const defaultClient = axios.create({
  baseURL: process.env.SASHIDO_API_URL,
  headers: {
    'X-Parse-Application-Id': process.env.SASHIDO_APP_ID,
    'X-Parse-REST-API-Key': process.env.SASHIDO_REST_KEY,
    // 'X-Parse-Session-Token': token,
    'Content-Type': 'application/json'
  }
});

const AxiosContext = createContext<() => AxiosInstance>(() => defaultClient);

export const AxiosProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState('' as string);

  let retryCount = 0;
  const maxRetries = 10;

  useEffect(() => {
    const getToken = async () => {
      const tk = (await userDataHandler('read', 'token')) as string;
      setToken(tk);
    };
    getToken();
  }, []);

  const axiosclient = useCallback(() => {
    const client = axios.create({
      baseURL: process.env.SASHIDO_API_URL,
      headers: {
        'X-Parse-Application-Id': process.env.SASHIDO_APP_ID,
        'X-Parse-REST-API-Key': process.env.SASHIDO_REST_KEY,
        // 'X-Parse-Master-Key': process.env.SASHIDO_MASTER_KEY,
        'X-Parse-Session-Token': token,
        'Content-Type': 'application/json'
      }
    });

    axiosRetry(client, {
      retries: maxRetries,
      retryCondition: (error: AxiosError) => {
        console.log(error);

        // Check for network connectivity before retrying
        return (
          axiosRetry.isNetworkError(error) ||
          (typeof error?.response?.status === 'number' &&
            error?.response?.status >= 500) ||
          error.code === 'ECONNABORTED'
        );
      },
      retryDelay: count => {
        return count * 18000;
      }
    });

    client.interceptors.response.use(
      response => response,
      error => {
        retryCount += 1;
        if (retryCount >= maxRetries) {
          retryCount = 0; // Reset retry count if maximum retries exceeded
        }
        return Promise.reject(error);
      }
    );

    return client;
  }, [token]);

  return (
    <AxiosContext.Provider value={axiosclient}>
      {children}
    </AxiosContext.Provider>
  );
};

export const useAxiosClient = () => {
  return useContext(AxiosContext);
};
