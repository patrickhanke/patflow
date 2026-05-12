import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  date_content: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 30,
    justifyContent: 'flex-start',
    paddingHorizontal: 12
  },
  date_container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 12,
    gap: 6,
    justifyContent: 'flex-start'
  },
  align_center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  time_buttons_container: {
    width: '100%',
    height: 90,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'stretch'
  },
  edit_time_display: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 3,
    marginBottom: 6,
    borderBottomWidth: 1.2
  },
  edit_time_display_text: {
    fontSize: 21,
    fontWeight: '500'
  },
  edit_time_display_text_pause: {
    fontSize: 18,
    fontWeight: '500'
  },
  edit_time_display_label_pause: {
    fontSize: 15,
    fontWeight: '500'
  },
  pause_input: {
    width: 60,
    borderRadius: 6,
    borderWidth: 0.6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    textAlign: 'center'
  },
  break_container: {
    height: 'auto',
    overflow: 'visible',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 12,
    gap: 6,
    borderRadius: 6
  }
});

export default styles;
