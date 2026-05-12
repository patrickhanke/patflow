import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  slidein_container: {
    paddingTop: 24,
    paddingBottom: 24,
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 18,
    width: '100%'
  },
  slidein_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  task_complete_button: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12
  },
  user_container: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6
  },
  description_container: {
    width: '100%',
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'flex-start'
  }
});

export default styles;
