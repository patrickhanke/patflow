import { TaskState, Task, Comment, Document } from '@types';

export type EditAssignedStaffProps = {
  assignedStaff: string[];
  saveAssignedStaff: (assignedStaff: string[]) => void;
  isVisible?: boolean;
  setIsVisible?: (isVisible: boolean) => void;
};

export type SelectPropertyProps = {
  selectedProperty: string;
  saveSelectedProperty: (selectedProperty: string) => void;
};

export type SelectTicketProps = {
  selectedTicket: string;
  saveSelectedTicket: (selectedTicket: string) => void;
};

export type EditDescriptionProps = {
  initialDescription: string;
  saveDescription: (description: string) => void;
};

export type CreateTaskUpdateObject = {
  title: string;
  description: string;
  documents: Document[];
  created_by: { __type: 'Pointer'; className: '_User'; objectId: string };
  state: TaskState;
  time: Task['time'] | null;
  comments: Comment[];
  assigned_staff: string[];
  ticket?: { __type: 'Pointer'; className: 'Ticket'; objectId: string };
  property?: { __type: 'Pointer'; className: 'Property'; objectId: string };
  project?: { __type: 'Pointer'; className: 'Project'; objectId: string };
  type: string;
  category: string;
  dates: string[] | undefined;
  images: string[];
};
