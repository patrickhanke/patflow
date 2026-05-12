import { Task } from '@types';

export type TaskProps = {
  task: Task & { date: string };
  isLast: boolean;
  refetch: () => Promise<Task[]>;
  isAdmin?: boolean;
};
