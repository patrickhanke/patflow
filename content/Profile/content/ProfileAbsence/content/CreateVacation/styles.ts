import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  date_content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
    justifyContent: 'flex-start'
  },
  date_container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 6,
    justifyContent: 'flex-start'
  },
  align_center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  time_buttons_container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
    alignItems: 'center'
  },
  edit_time_display: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 6,
    marginBottom: 6,
    borderBottomWidth: 1.2
  },
  edit_time_display_text: {
    fontSize: 24,
    fontWeight: '500'
  },
  pause_input: {
    width: 60,
    borderRadius: 6,
    borderWidth: 0.6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    textAlign: 'center'
  }
});

export default styles;
