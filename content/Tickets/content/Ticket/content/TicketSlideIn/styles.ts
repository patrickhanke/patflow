import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  slidein_container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 12,
    width: '100%',
    height: '100%'
  },
  slidein_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  description_container: {
    width: '100%',
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6
  }
});

export default styles;
