import { Comment } from '@types';

export type CommentInterfaceProps = {
  comments: Comment[];
  refetch?: () => void;
  createCommentButton?: boolean;
  onClick?: () => void;
  scrollEnabled?: boolean;
};
