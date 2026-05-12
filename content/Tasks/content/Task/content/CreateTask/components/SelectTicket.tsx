import {
  ElementSelectInterface,
  IconButton,
  IconDisplay,
  SelectElement,
  ThemeContext,
  useParse
} from '@provider';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SelectTicketProps } from '../types';
import { Ticket } from '@types';
import styles from '../styles';

const SelectTicket: React.FC<SelectTicketProps> = ({
  selectedTicket,
  saveSelectedTicket
}) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const { Parse, isReady } = useParse();
  const [selectTicket, setSelectTicket] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const loadTickets = useCallback(async () => {
    if (!isReady) return;

    setQueryLoading(true);
    try {
      const TicketClass = Parse.Object.extend('Ticket');
      const query = new Parse.Query(TicketClass);
      query.equalTo('state', 'open');
      query.equalTo('task', null);

      const results = await query.find();
      setTickets(results.map(r => r.toJSON() as Ticket));
    } catch (error) {
      console.error('Error loading tickets:', error);
      setTickets([]);
    } finally {
      setQueryLoading(false);
    }
  }, [isReady, Parse]);

  useEffect(() => {
    if (isReady) {
      loadTickets();
    }
  }, [isReady, loadTickets]);

  const elements = useMemo(() => {
    if (tickets.length > 0) {
      return tickets.map((ticket: Ticket) => ({
        value: ticket.objectId,
        label: `${ticket.title}`
      }));
    }
    return [];
  }, [tickets]);

  const [selectedTicketElement, setSelectedTicketElement] =
    useState<SelectElement | null>(
      selectedTicket
        ? elements.find(
            (element: SelectElement) => element.value === selectedTicket
          )
        : null
    );

  useEffect(() => {
    if (elements && selectedTicketElement === null) {
      const ticketElement = elements.find(
        (element: SelectElement) => element.value === selectedTicket
      );
      if (ticketElement) {
        setSelectedTicketElement(ticketElement);
      }
    }
  }, [elements]);

  if (queryLoading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <View style={applicationStyles.horizontal_container}>
        <Text style={applicationStyles.small_header}>Ticket auswählen</Text>
        <IconButton
          icon="edit"
          onPress={() => setSelectTicket(true)}
          size="medium"
        />
      </View>
      <View style={styles.user_container}>
        <IconDisplay
          icon="ticket"
          color={themeColors.text}
          fontColor={themeColors.text}
          size={18}
        />
        <ScrollView
          style={{ flex: 1, marginLeft: 12 }}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 6,
            paddingVertical: 3
          }}
          horizontal
        >
          <Text>{selectedTicketElement?.label}</Text>
        </ScrollView>
      </View>
      <ElementSelectInterface
        elements={elements}
        title="Ticket auswählen"
        selectAll={false}
        selectProperty={false}
        onSelect={eles => {
          setSelectedTicketElement(eles[0] || null);
        }}
        selectedElements={selectedTicketElement ? [selectedTicketElement] : []}
        isSearchable
        max={1}
        isVisible={selectTicket}
        setIsVisible={setSelectTicket}
        onSave={() => {
          if (selectedTicketElement) {
            saveSelectedTicket(selectedTicketElement.value);
          }
          setSelectTicket(false);
        }}
        loading={queryLoading}
      />
    </>
  );
};

export default SelectTicket;
