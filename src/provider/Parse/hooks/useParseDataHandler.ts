/**
 * useParseDataHandler - Hook for Parse CRUD operations
 * Drop-in replacement for the existing useDataHandler hook
 */

import { useState, useCallback, useMemo, useContext } from 'react';
import Parse from 'parse/react-native';
import { Asset } from 'react-native-image-picker';
import { Message, MessageTypes, MessageUpdateObject, User } from '@types';
import { AppContext } from '../../context';

export interface UseParseDataHandlerReturn {
  loading: boolean;
  updateData: (params: {
    className: string;
    objectId: string;
    updateObject: Record<string, any>;
    afterSaveHandler?: (objectId: string) => void;
    feedback?: string;
  }) => Promise<any[]>;
  createData: (params: {
    className: string;
    query?: string;
    updateObject?: Record<string, any>;
    afterSaveHandler?: (objectId: string) => void;
    message?: {
      type: Message['type'];
      users: User['objectId'][];
    };
    feedback?: string;
  }) => Promise<any[]>;
  deleteData: (params: {
    className: string;
    objectId: string;
    afterSaveHandler?: (objectId: string) => void;
    feedback?: string;
  }) => Promise<void>;
  getData: (params: {
    className: string;
    query?: string;
    constraints?: Record<string, any>;
    options?: {
      include?: string[];
      limit?: number;
      skip?: number;
      orderBy?: string;
    };
  }) => Promise<any[]>;
}

/**
 * Hook for Parse data operations - compatible with existing useDataHandler API
 */
function useParseDataHandler(): UseParseDataHandlerReturn {
  const { user } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [_feedback, setFeedback] = useState({
    message: '',
    type: 'success',
    date: new Date()
  });

  // Create message for notifications
  const createMessageHandler = useCallback(
    async (type: MessageTypes, id: string, users: User['objectId'][]) => {
      const updateObject: MessageUpdateObject = {
        is_read: false,
        type: type
      };

      if (type === 'task_created') {
        const TaskClass = Parse.Object.extend('Task');
        updateObject.task = TaskClass.createWithoutData(id);
      }

      if (type === 'ticket_created') {
        const TicketClass = Parse.Object.extend('Ticket');
        updateObject.ticket = TicketClass.createWithoutData(id);
      }

      const UserClass = Parse.Object.extend('_User');

      for (const userId of users) {
        try {
          const MessageClass = Parse.Object.extend('Message');
          const message = new MessageClass();

          Object.entries(updateObject).forEach(([key, value]) => {
            message.set(key, value);
          });

          message.set('created_by', UserClass.createWithoutData(user.objectId));
          message.set('user', UserClass.createWithoutData(userId));

          await message.save();
        } catch (error) {
          console.error('Failed to create message:', error);
        }
      }
    },
    [user]
  );

  // Update existing object
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
      updateObject: Record<string, any>;
      afterSaveHandler?: (objectId: string) => void;
      feedback?: string;
    }): Promise<any[]> => {
      const data: any[] = [];
      setLoading(true);

      try {
        const query = new Parse.Query(className);
        const object = await query.get(objectId);

        // Process update object to handle Parse pointers
        Object.entries(updateObject).forEach(([key, value]) => {
          if (
            value &&
            typeof value === 'object' &&
            '__type' in value &&
            value.__type === 'Pointer'
          ) {
            const PointerClass = Parse.Object.extend(value.className);
            object.set(key, PointerClass.createWithoutData(value.objectId));
          } else {
            object.set(key, value);
          }
        });

        await object.save();

        if (feedback) {
          setFeedback({ message: feedback, type: 'success', date: new Date() });
        }
        if (afterSaveHandler) {
          afterSaveHandler(object.id);
        }
      } catch (error: any) {
        console.error('Update error:', error.message);
      }

      setLoading(false);
      return data;
    },
    []
  );

  // Delete object
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
    }): Promise<void> => {
      setLoading(true);

      try {
        const query = new Parse.Query(className);
        const object = await query.get(objectId);
        await object.destroy();

        if (feedback) {
          setFeedback({ message: feedback, type: 'success', date: new Date() });
        }
        if (afterSaveHandler) {
          afterSaveHandler(objectId);
        }
      } catch (error) {
        console.error('Delete error:', error);
      }

      setLoading(false);
    },
    []
  );

  // Create new object
  const createData = useCallback(
    async ({
      className,
      updateObject,
      afterSaveHandler,
      message,
      feedback
    }: {
      className: string;
      query?: string;
      updateObject?: Record<string, any>;
      afterSaveHandler?: (objectId: string) => void;
      message?: {
        type: Message['type'];
        users: User['objectId'][];
      };
      feedback?: string;
    }): Promise<any[]> => {
      const data: any[] = [];
      setLoading(true);

      try {
        const ParseClass = Parse.Object.extend(className);
        const object = new ParseClass();

        if (updateObject) {
          // Process update object to handle Parse pointers
          Object.entries(updateObject).forEach(([key, value]) => {
            if (
              value &&
              typeof value === 'object' &&
              '__type' in value &&
              value.__type === 'Pointer'
            ) {
              const PointerClass = Parse.Object.extend(value.className);
              object.set(key, PointerClass.createWithoutData(value.objectId));
            } else {
              object.set(key, value);
            }
          });
        }

        await object.save();

        if (feedback) {
          setFeedback({ message: feedback, type: 'success', date: new Date() });
        }
        if (afterSaveHandler) {
          afterSaveHandler(object.id);
        }
        if (message) {
          await createMessageHandler(message.type, object.id, message.users);
        }
      } catch (error) {
        console.error('Create error:', error);
        setFeedback({ message: 'Fehler', type: 'error', date: new Date() });
      }

      setLoading(false);
      return data;
    },
    [createMessageHandler]
  );

  // Get/Find objects
  const getData = useCallback(
    async ({
      className,
      query: queryString,
      constraints,
      options
    }: {
      className: string;
      query?: string;
      constraints?: Record<string, any>;
      options?: {
        include?: string[];
        limit?: number;
        skip?: number;
        orderBy?: string;
      };
    }): Promise<any[]> => {
      let data: any[] = [];
      setLoading(true);

      try {
        const query = new Parse.Query(className);

        // Parse the legacy query string format if provided
        if (queryString) {
          try {
            const parsedQuery = JSON.parse(`{${queryString}}`);
            Object.entries(parsedQuery).forEach(([key, value]) => {
              if (
                value &&
                typeof value === 'object' &&
                '__type' in (value as any) &&
                (value as any).__type === 'Pointer'
              ) {
                const PointerClass = Parse.Object.extend(
                  (value as any).className
                );
                query.equalTo(
                  key,
                  PointerClass.createWithoutData((value as any).objectId)
                );
              } else {
                query.equalTo(key, value);
              }
            });
          } catch (parseError) {
            console.warn('Could not parse legacy query string:', queryString);
          }
        }

        // Apply new-style constraints
        if (constraints) {
          Object.entries(constraints).forEach(([key, value]) => {
            if (
              value &&
              typeof value === 'object' &&
              '__type' in value &&
              value.__type === 'Pointer'
            ) {
              const PointerClass = Parse.Object.extend(value.className);
              query.equalTo(
                key,
                PointerClass.createWithoutData(value.objectId)
              );
            } else if (value && typeof value === 'object') {
              // Handle comparison operators
              if ('$gt' in value) query.greaterThan(key, value.$gt);
              if ('$gte' in value) query.greaterThanOrEqualTo(key, value.$gte);
              if ('$lt' in value) query.lessThan(key, value.$lt);
              if ('$lte' in value) query.lessThanOrEqualTo(key, value.$lte);
              if ('$ne' in value) query.notEqualTo(key, value.$ne);
              if ('$in' in value) query.containedIn(key, value.$in);
              if ('$nin' in value) query.notContainedIn(key, value.$nin);
            } else {
              query.equalTo(key, value);
            }
          });
        }

        // Apply options
        if (options) {
          // if (options.include) {
          //   options.include.forEach(field => query.include(field));
          // }
          if (options.limit) {
            query.limit(options.limit);
          }
          if (options.skip) {
            query.skip(options.skip);
          }
          if (options.orderBy) {
            if (options.orderBy.startsWith('-')) {
              query.descending(options.orderBy.substring(1));
            } else {
              query.ascending(options.orderBy);
            }
          }
        }

        const results = await query.find();
        data = results.map(obj => obj.toJSON());
      } catch (error) {
        console.error('Get data error:', error);
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
}

export default useParseDataHandler;
