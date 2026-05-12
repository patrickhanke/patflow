import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  calendar_container: {
    flex: 1,
    width: '100%',
    height: 'auto',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: 0,
    flexWrap: 'wrap',
    marginTop: 12
  },
  days_container: {
    width: '100%',
    height: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: 0,
    borderTopWidth: 1
  }
});

export default styles;
