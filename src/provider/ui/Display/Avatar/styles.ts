import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  staff_avatars_container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar_wrapper: {
    marginLeft: -8
  },
  avatar_first: {
    marginLeft: 0
  },
  avatar_image: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2
  },
  avatar_initials: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar_initials_text: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  avatar_count: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar_count_text: {
    fontSize: 11,
    fontWeight: '600'
  }
});

export default styles;
