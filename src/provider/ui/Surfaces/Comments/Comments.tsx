import React, { useContext } from 'react';
import { CommentInterfaceProps } from './types';
import { ScrollView, Text, View } from 'react-native';
import styles from './styles';
import { Comment as CommentType } from '@types';
import {
  IconButton,
  SingleImageDisplay,
  DateDisplay,
  IconDisplay,
  UserDisplay,
  ThemeContext,
  Divider
} from '@provider';

function sortCommentsByCreatedAt(comments: CommentType[]): CommentType[] {
  const commentsCopy = [...comments];
  return commentsCopy.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

const Comment = ({ comment }: { comment: CommentType }) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  return (
    <View
      style={[
        applicationStyles.section_element_container,
        styles.comment_container
        // {backgroundColor: themeColors.background}
      ]}
    >
      <View
        style={[
          styles.comment_header,
          { borderBottomColor: themeColors.border }
        ]}
      >
        {comment.userId && <UserDisplay userId={comment.userId} />}
        {!comment.userId && (
          <View>
            <Text style={{ color: themeColors.text }}>{comment.username}</Text>
          </View>
        )}
        <DateDisplay date={comment.createdAt} displayType="date-and-time" />
      </View>
      <View style={styles.comment_content}>
        {comment.image && (
          <View style={styles.comment_content_image}>
            <SingleImageDisplay image={comment.image} width={48} />
          </View>
        )}
        <View style={styles.comment_content_text}>
          <Text style={{ color: themeColors.text }}>{comment.text}</Text>
        </View>
      </View>
    </View>
  );
};

const CommentInterface = ({
  comments,
  createCommentButton = false,
  onClick,
  scrollEnabled = true
}: CommentInterfaceProps) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);

  return (
    <View style={{ flex: 1, gap: 12 }}>
      <View style={applicationStyles.horizontal_container}>
        {createCommentButton && (
          <IconDisplay
            text={`Kommentare (${comments?.length || 0})`}
            icon="comment"
            size={18}
            color={themeColors.text}
            fontColor={themeColors.text}
          />
        )}
      </View>
      {scrollEnabled ? (
        <ScrollView style={{ flex: 1 }}>
          {comments?.length > 0 &&
            sortCommentsByCreatedAt(comments).map((comment: CommentType) => (
              <Comment key={comment.createdAt} comment={comment} />
            ))}
        </ScrollView>
      ) : (
        <View>
          {comments?.length > 0 &&
            sortCommentsByCreatedAt(comments).map((comment: CommentType) => (
              <Comment key={comment.createdAt} comment={comment} />
            ))}
        </View>
      )}
      {onClick && (
        <IconButton
          icon="add"
          size="small"
          onPress={() => onClick()}
          color={themeColors.text}
          text="Kommentar"
          backgroundColor={'transparent'}
        />
      )}
    </View>
  );
};

export default CommentInterface;
