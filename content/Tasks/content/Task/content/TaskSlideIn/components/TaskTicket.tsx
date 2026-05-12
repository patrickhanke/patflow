import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Divider,
  IconButton,
  IconDisplay,
  ImageDisplay,
  ThemeContext,
  ticket_state_options,
  transformToColor
} from '@provider';
import { Ticket } from '@types';

const styles = StyleSheet.create({
  slidein_container: {
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 12,
    width: '100%'
  },
  slidein_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  description_container: {
    width: '100%',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  }
});

const TaskTicket = ({ ticket }: { ticket: Ticket }) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);

  return (
    <View style={styles.slidein_container}>
      <View style={styles.slidein_header}>
        <Text style={applicationStyles.medium_header}>{ticket.title}</Text>
        <IconButton
          icon="state"
          size="small"
          backgroundColor={transformToColor(
            ticket_state_options.find(
              ticketState => ticketState.value === ticket.state
            )?.color
          )}
          text={
            ticket_state_options.find(
              ticketState => ticketState.value === ticket.state
            )?.label
          }
          color="black"
        />
      </View>
      <Divider />

      <View style={{ flexBasis: 30 }}>
        <IconDisplay
          icon="property"
          color={themeColors.text}
          text={ticket?.property?.name}
          fontColor={themeColors.text}
          size={18}
        />
      </View>
      <Divider />
      <View style={styles.description_container}>
        <IconDisplay
          icon="description"
          color={themeColors.text}
          fontColor="white"
          size={18}
        />
        <Text
          lineBreakMode="clip"
          textBreakStrategy="simple"
          style={[
            applicationStyles.small_header,
            { color: themeColors.text, flex: 1, position: 'relative' }
          ]}
        >
          {ticket.description || '-'}
        </Text>
      </View>
      <Divider />
      <View style={{ flex: 1, flexBasis: 60 }}>
        <View style={applicationStyles.horizontal_container}>
          <IconDisplay
            text="Bilder"
            icon="image"
            size={18}
            color={themeColors.text}
          />
        </View>
        <ScrollView style={{ flex: 1 }}>
          <ImageDisplay imageIds={ticket.images} />
        </ScrollView>
      </View>
    </View>
  );
};

export default TaskTicket;
