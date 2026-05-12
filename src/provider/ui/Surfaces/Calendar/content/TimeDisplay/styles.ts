import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  day_container: {
    flex: 1,
    width: '100%',
    height: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  time_buttons_container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start'
  },
  time_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3
    // borderWidth: StyleSheet.hairlineWidth
  },
  select_container: {
    width: '100%',
    height: 'auto',
    paddingVertical: 6,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: 0
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
  },
  date: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'right',
    width: 24
  },
  horizontal_line: {
    height: 18,
    width: 3,
    // marginLeft: 6,
    marginRight: 6,
    borderRadius: 1
  }
});

export default styles;
