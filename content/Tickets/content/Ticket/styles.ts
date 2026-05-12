import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  ticket_content: {
    // width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  ticket_content_pressable: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 6
  },
  ticket_state_display: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 18
  }
});

export default styles;
