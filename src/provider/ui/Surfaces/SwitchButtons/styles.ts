import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  buttons_container: {
    paddingVertical: 12,
    width: 'auto'
  },
  switch_button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 0
  },
  switch_button_text: {
    fontWeight: '600',
    fontSize: 15
  },
  number_indicator: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6
  }
});

export default styles;
