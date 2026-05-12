import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  profile_settings_container: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 0,
    paddingVertical: 6
  },
  user_portrait_container: {
    flex: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'black',
    overflow: 'visible'
  },
  user_portrait_image: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    resizeMode: 'cover'
  }
});

export default styles;
