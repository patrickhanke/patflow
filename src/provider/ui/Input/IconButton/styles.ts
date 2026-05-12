import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  icon_button: {
    borderRadius: 6,
    flex: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
    borderWidth: StyleSheet.hairlineWidth
  },
  button_medium: {
    padding: 6
  },
  icon_button_text: {
    fontSize: 18,
    fontWeight: '400'
  },
  button_small: {
    display: 'flex',
    paddingHorizontal: 6,
    paddingVertical: 6
  },
  icon_button_text_small: {
    fontSize: 12,
    fontWeight: '400'
  }
});

const icon_button_medium = StyleSheet.compose(
  styles.icon_button,
  styles.button_medium
);

const icon_button_small = StyleSheet.compose(
  styles.icon_button,
  styles.button_small
);

export default StyleSheet.flatten({
  ...styles,
  icon_button_medium,
  icon_button_small
});
