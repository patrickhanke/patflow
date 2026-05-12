import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  data_container: {
    position: 'relative',
    width: '14%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: 6,
    paddingTop: 24,
    minHeight: 60,
    borderRadius: 6
  },
  data_element: {
    width: '100%',
    height: 12
  },
  day_label_container: {
    position: 'absolute',
    width: 21,
    height: 21,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 11.5,
    top: 3,
    left: '46%'
  },
  data_element_label: {
    fontSize: 8,
    fontWeight: '600',
    marginLeft: 6
  }
});

export default styles;
