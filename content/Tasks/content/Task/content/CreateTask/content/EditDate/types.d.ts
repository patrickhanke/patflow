import { DateObject, Task } from '@types';

export type EditDateProps = {
  initialDate?: Task['time'];
  saveDate: (date: Task['time']) => void;
};

export type SingleDateSelectInterfaceProps = {
  date: DateObject;
  category: (typeof date_category_options)[number]['value'];
  onChange: (value: DateObject) => void;
};

export type MultiDateSelectInterfaceProps = {
  date: DateObject;
  category: (typeof date_category_options)[number]['value'];
  onChange: (value: DateObject) => void;
};
