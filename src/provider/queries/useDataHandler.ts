'use client';

import { useCallback, useContext, useMemo, useState } from 'react';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, MessageTypes, MessageUpdateObject, User } from '@types';
import { AppContext, useAxiosClient } from '../context';

const useDataHandler = () => {
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const axiosclient = useAxiosClient();
  const [_feedback, setFeedback] = useState({
    message: '',
    type: 'success',
    date: new Date()
  });

  const createMessageHandler = async (
    type: MessageTypes,
    id: string,
    users: User['objectId'][]
  ) => {
    const updateObject: MessageUpdateObject = {
      is_read: false,
      type: type
    };

    if (type === 'task_created') {
      updateObject.task = {
        __type: 'Pointer',
        className: 'Task',
        objectId: id
      };
    }

    if (type === 'ticket_created') {
      updateObject.ticket = {
        __type: 'Pointer',
        className: 'Ticket',
        objectId: id
      };
    }

    users.forEach(userId => {
      createData({
        className: 'Message',
        updateObject: {
          ...updateObject,
          created_by: {
            __type: 'Pointer',
            className: '_User',
            objectId: user.objectId
          },
          user: { __type: 'Pointer', className: '_User', objectId: userId }
        }
      });
    });
  };

  const updateData = useCallback(
    async ({
      className,
      objectId,
      updateObject,
      afterSaveHandler,
      feedback
    }: {
      className: string;
      objectId: string;
      updateObject: object;
      afterSaveHandler?: (objectId: string) => void;
      feedback?: string;
    }) => {
      let data: Array<any> = [];
      setLoading(true);

      await axiosclient()
        .put(
          `classes/${className}/${objectId}`,
          updateObject as AxiosRequestConfig<any>
        )
        .then((response: AxiosResponse<any, any>) => {
          data = response.data.results;
          if (feedback) {
            setFeedback({
              message: feedback,
              type: 'success',
              date: new Date()
            });
          }
          if (afterSaveHandler) {
            afterSaveHandler(response.data.objectId);
          }
        })
        .catch((error: { message: string }) => {
          console.log(error.message);
        });
      setLoading(false);

      return data;
    },
    []
  );

  const deleteData = useCallback(
    async ({
      className,
      objectId,
      afterSaveHandler,
      feedback
    }: {
      className: string;
      objectId: string;
      afterSaveHandler?: (objectId: string) => void;
      feedback?: string;
    }) => {
      setLoading(true);

      await axiosclient()
        .delete(`classes/${className}/${objectId}`)
        .then((response: AxiosResponse<any, any>) => {
          if (feedback) {
            setFeedback({
              message: feedback,
              type: 'success',
              date: new Date()
            });
          }
          if (afterSaveHandler) {
            afterSaveHandler(response.data.objectId);
          }
        })
        .catch(error => {
          console.log(error);
        });
      setLoading(false);
    },
    []
  );

  const createData = useCallback(
    async ({
      className,
      query,
      updateObject,
      afterSaveHandler,
      message,
      feedback
    }: {
      className: string;
      query?: string;
      updateObject?: object;
      afterSaveHandler?: (objectId: string) => void;
      message?: {
        type: Message['type'];
        users: User['objectId'][];
      };
      feedback?: string;
    }) => {
      const data: Array<any> = [];
      setLoading(true);
      await axiosclient()
        .post(
          `classes/${className}`,
          query || (updateObject as AxiosRequestConfig<any>)
        )
        .then((response: AxiosResponse<any, any>) => {
          if (feedback) {
            setFeedback({
              message: feedback,
              type: 'success',
              date: new Date()
            });
          }
          if (afterSaveHandler) {
            afterSaveHandler(response.data.objectId);
          }
          if (message) {
            createMessageHandler(
              message.type,
              response.data.objectId,
              message.users
            );
          }
        })
        .catch(error => {
          console.log(error);
          setFeedback({ message: 'Fehler', type: 'error', date: new Date() });
        });
      setLoading(false);
      return data;
    },
    []
  );

  const getData = useCallback(
    async ({ className, query }: { className: string; query?: string }) => {
      let data: Array<any> = [];
      setLoading(true);
      if (query) {
        await axiosclient()
          .get(`classes/${className}?where={${query}}`)
          .then((response: AxiosResponse<any, any>) => {
            data = response.data.results;
          })
          .catch(error => {
            console.error(`Error: ${error.message}`);
          });
      }
      if (!query) {
        await axiosclient()
          .get(`classes/${className}`)
          .then((response: AxiosResponse<any, any>) => {
            data = response.data.results;
          })
          .catch(error => {
            console.error(`Error: ${error}`);
          });
      }
      setLoading(false);
      return data;
    },
    []
  );

  const returnFunctions = useMemo(() => {
    return {
      loading,
      updateData,
      createData,
      deleteData,
      getData
    };
  }, [loading, updateData, createData, deleteData, getData]);

  return returnFunctions;
};

export default useDataHandler;
