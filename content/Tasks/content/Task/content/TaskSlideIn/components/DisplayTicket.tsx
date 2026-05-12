import React, { useContext, useEffect, useState } from 'react';
import {
  IconButton,
  IconDisplay,
  Modal,
  ThemeContext,
  useParse
} from '@provider';
import { Text, View } from 'react-native';
import TaskTicket from './TaskTicket';

const DisplayTicket = ({ ticketId }: { ticketId: string }) => {
  const { Parse, isReady } = useParse();
  const [ticket, setTicket] = useState<any>(null);
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const [showTicketModal, setShowTicketModal] = useState(false);

  useEffect(() => {
    const loadTicket = async () => {
      if (!isReady || !ticketId) return;

      try {
        const TicketClass = Parse.Object.extend('Ticket');
        const query = new Parse.Query(TicketClass);

        const result = await query.get(ticketId);
        setTicket(result.toJSON());
      } catch (error) {
        console.error('Error loading ticket:', error);
        setTicket(null);
      }
    };

    loadTicket();
  }, [isReady, Parse, ticketId]);

  if (!ticket) {
    return (
      <View style={{ paddingHorizontal: 12 }}>
        <Text>Fehler beim Laden des Tickets oder Ticket nicht gefunden</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        applicationStyles.horizontal_container,
        { justifyContent: 'flex-start' }
      ]}
    >
      <IconDisplay icon="ticket" color={themeColors.border} size={21} />
      <View>
        <IconButton
          text={'Ticket anzeigen'}
          icon="info"
          size="small"
          onPress={() => setShowTicketModal(true)}
        />
      </View>
      <Modal
        isVisible={showTicketModal}
        setIsVisible={() => setShowTicketModal(false)}
        dataHasChanged={false}
      >
        <TaskTicket ticket={ticket} />
      </Modal>
    </View>
  );
};

export default DisplayTicket;
