import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';

type RootTabParamList = {
  Aufgaben: { admin?: boolean };
  Tickets: undefined;
  Arbeiteszeiten: undefined;
  Profil: undefined;
  Admin: { admin?: boolean };
};

export type TasksProps = {
  navigation: BottomTabNavigationProp<RootTabParamList, 'Aufgaben' | 'Admin'>;
  route?: RouteProp<RootTabParamList, 'Aufgaben' | 'Admin'>;
  admin?: boolean;
};

export type TaskProps = {
  title: string;
};

export type TaskSection = {
  title: string;
  id:
    | 'this_week'
    | 'next_week'
    | 'after_next_week'
    | 'overdue'
    | 'today'
    | 'future';
  date: string;
  data: DataTypes.Task[];
}[];

export type siteStates = 'this_week' | 'next_week' | 'after_next_week';

export type TaskSectionObject = {
  [key: siteStates[number]]: TaskSection;
};
