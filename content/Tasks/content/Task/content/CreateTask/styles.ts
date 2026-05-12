import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  slidein_container: {
    paddingTop: 24,
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 12,
    width: '100%',
    maxHeight: '100%'
  },
  scroll_container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 12
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    padding: 0,
    margin: 0,
    gap: 0
  },
  description_container: {
    width: '100%',
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'flex-start'
  }
});

export default styles;
