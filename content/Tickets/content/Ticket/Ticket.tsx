import React, { useContext } from 'react';
import { Pressable, Text, View } from 'react-native';
import styles from './styles';
import {
  getDateStringsFromIso,
  GlobalModal,
  IconDisplay,
  ThemeContext,
  ticket_state_options,
  transformToColor
} from '@provider';
import { Ticket as TicketType } from '@types';
import TicketSlideIn from './content/TicketSlideIn';

const Ticket = ({
  ticket,
  refetch,
  isLast
}: {
  ticket: TicketType;
  refetch: () => Promise<TicketType[]>;
  isLast: boolean;
}) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <Pressable
        hitSlop={6}
        style={[
          applicationStyles.section_element_container,
          { borderBottomWidth: isLast ? 0 : 1 }
        ]}
        onPress={() => setShowModal(true)}
      >
        <View style={styles.ticket_content}>
          <View style={styles.ticket_content_pressable}>
            <Text style={[applicationStyles.small_header]}>{ticket.title}</Text>
            <View style={styles.ticket_state_display}>
              <IconDisplay
                icon="calendar"
                text={`${getDateStringsFromIso(ticket.createdAt).datum} - ${
                  getDateStringsFromIso(ticket.createdAt).uhrzeit
                }`}
                color={themeColors.light_font}
                fontColor={themeColors.light_font}
              />
            </View>
          </View>
          <Pressable hitSlop={6} onPress={() => setShowModal(true)}>
            <IconDisplay
              icon="state"
              color={transformToColor(
                ticket_state_options.find(
                  ticketState => ticketState.value === ticket.state
                )?.color
              )}
              fontColor={transformToColor(
                ticket_state_options.find(
                  ticketState => ticketState.value === ticket.state
                )?.color
              )}
              text={
                ticket_state_options.find(
                  ticketState => ticketState.value === ticket.state
                )?.label
              }
            />
          </Pressable>
        </View>
      </Pressable>
      <GlobalModal
        isVisible={showModal}
        dataHasChanged={false}
        title={ticket.title}
        backHandler={() => {
          setShowModal(false);
        }}
      >
        <TicketSlideIn ticket={ticket} refetch={refetch} />
      </GlobalModal>
    </>
  );
};

export default Ticket;
