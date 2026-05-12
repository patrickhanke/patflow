import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  profile_absence_container: {
    flex: 1,
    gap: 12
  },
  profile_absence_content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  profile_absence_date: {
    // flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 6
  },
  select_container: {
    flex: 0,
    flexShrink: 0,
    width: '100%',
    height: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 6,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: 0
  },
  profile_absence_state_display: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 6
  }
});

export default styles;
