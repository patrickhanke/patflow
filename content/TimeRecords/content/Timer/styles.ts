import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  timer_container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: 12,
    paddingVertical: 6
  },
  timer_buttons: {
    marginTop: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 24
  },
  timer_button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    overflow: 'hidden',
    borderRadius: 48
  },
  timer_button_disabled: {
    opacity: 0.5
  },
  timer_display: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0
  },
  timer_display_time_text: {
    fontSize: 78,
    fontWeight: 'bold'
  },
  timer_display_pause_text: {
    fontSize: 36,
    fontWeight: 'bold'
  },
  timer_indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    elevation: 2,
    marginRight: 6
  },
  time_text: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center'
  },
  icon_container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    gap: 6,
    width: 90
  }
});

export default styles;
