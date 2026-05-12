import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  calendar_header_container: {
    height: 90,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6
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
  }
});

export default styles;
