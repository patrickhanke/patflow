import { Filter, Ticket } from '@types';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type RootTabParamList = {
  Aufgaben: { admin?: boolean };
  Tickets: undefined;
  Arbeiteszeiten: undefined;
  Profil: undefined;
  Admin: { admin?: boolean };
};

export type TicketsProps = {
  navigation: BottomTabNavigationProp<RootTabParamList, 'Tickets'>;
};

export type TicketsComponent = {
  id?: string;
  className?: string;
};

export type useGetTicketsHook = {
  filters: Filter[];
  archived?: boolean;
};

export type SortTicketsForList = (
  array: Array<Ticket>,
  properties: Array<Property>
) => { title: string; data: Ticket[] }[] | null;
