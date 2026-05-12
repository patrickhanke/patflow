import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  buttons_container: {
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 12
    // flex: 1
  },
  switch_button: {
    // flexShrink: 1,
    flexGrow: 1,
    textAlign: 'center',
    // flexWrap: 'wrap',
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    borderBottomWidth: 2
  },
  switch_button_text: {
    fontSize: 13,
    fontWeight: 500
  },
  number_indicator: {
    width: 18,
    height: 18,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default styles;
