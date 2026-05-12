import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState
} from 'react';
import { Keyboard, Text, View } from 'react-native';
import {
  Button,
  parseErrorMessage,
  TextInput,
  ThemeContext,
  useParse,
  useSaveImages
} from '@provider';
import { AppContext, useAxiosClient } from '@provider';
import styles from './styles';
import uuid from 'react-native-uuid';
import { Comment } from '@types';

const CreateComment = ({
  id,
  type,
  refetch,
  setShowComments,
  loading = false,
  onCreateComment
}: {
  id: string;
  type: 'task' | 'ticket';
  refetch: () => void;
  setShowComments: Dispatch<SetStateAction<boolean>>;
  loading?: boolean;
  onCreateComment?: (C?: Comment) => void;
}) => {
  const { user, isConnected } = useContext(AppContext);
  const axiosclient = useAxiosClient();
  const [text, setText] = useState(undefined as unknown as string);
  const { indicatorHandler } = useContext(AppContext);
  const [commentLoading, setCommentLoading] = useState(false);
  const { applicationStyles, themeColors } = useContext(ThemeContext);
  const { saveImages } = useSaveImages({ isConnected });
  const { Parse } = useParse();

  const addComment = useCallback(async () => {
    setCommentLoading(true);
    Keyboard.dismiss();
    const indicatorElement = {
      loading: 'Kommentar wird erstellt',
      error: 'Fehler beim Erstellen',
      success: 'Kommentar erfolgreich erstellt',
      id: uuid.v4() as string
    };
    indicatorHandler(indicatorElement, 'loading');

    try {
      if (id && type) {
        const comment = {
          id: uuid.v4(),
          userId: user.objectId,
          username: `${user.first_name} ${user.last_name}`,
          createdAt: new Date().toISOString(),
          text
        };

        const Tasks = Parse.Object.extend('Task');
        const taskQuery = new Parse.Query(Tasks);
        const Task = await taskQuery.get(id);

        const currentComments = Task.get('comments') || [];

        Task.set('comments', [...currentComments, comment]);
        await Task.saveEventually();
        await Task.pin().then(() => {
          console.log('Task object pinned:', Task.id);
        });

        if (!isConnected) {
          indicatorHandler(
            {
              ...indicatorElement,
              success: 'Kommentar erstellt'
            },
            'success'
          );
        } else {
          indicatorHandler(indicatorElement, 'success');
        }
      }
    } catch (error) {
      indicatorHandler(
        {
          ...indicatorElement,
          error: parseErrorMessage(error) || indicatorElement.error
        },
        'error'
      );
    }

    setShowComments(true);
    setCommentLoading(false);

    if (onCreateComment) {
      onCreateComment();
    }

    if (refetch) {
      refetch();
    }
  }, [
    user,
    text,
    id,
    type,
    saveImages,
    isConnected,
    indicatorHandler,
    axiosclient,
    setShowComments,
    onCreateComment,
    refetch
  ]);

  return (
    <View style={styles.create_comment_container}>
      <Text style={[applicationStyles.medium_header, { textAlign: 'center' }]}>
        Neuer Kommentar
      </Text>
      <TextInput
        defaultValue={''}
        placeholder="Neuer Kommentar"
        onChange={value => setText(value)}
        multiline={true}
      />
      <View style={applicationStyles.button_container}>
        <Button
          size="medium"
          onPress={() => addComment()}
          text="Kommentar senden"
          color={themeColors.primary}
          disabled={!text || loading || commentLoading}
        />
        <Button
          size="medium"
          onPress={() => {
            setShowComments(true);
          }}
          text="Abbrechen"
          color={themeColors.light}
          fontColor={themeColors.dark}
          disabled={loading || commentLoading}
        />
      </View>
    </View>
  );
};

export default CreateComment;
