import { StyleSheet } from 'react-native';

const appStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 6,
    paddingHorizontal: 12
    // elevation: 3
  },
  head_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6
  },
  header_title: {
    fontSize: 24,
    fontWeight: '500'
  },
  header_subtitle: {
    fontSize: 18,
    fontWeight: '500'
  },
  connection_indicator: {
    width: 6,
    height: 6,
    borderRadius: 3
  }
});

export default appStyles;
