import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  dates_container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
    paddingBottom: 24,
    height: '100%'
  },
  date_content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
    justifyContent: 'flex-start'
  },
  date_container: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6
  },
  delete_button: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    right: 12,
    padding: 6,
    borderRadius: 18,
    height: 30,
    width: 30,
    zIndex: 22
  },
  align_center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  time_buttons_container: {
    flex: 0.8,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 12,
    alignItems: 'center'
  },
  edit_time_display: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 6
  },
  edit_time_display_text: {
    fontSize: 21,
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
