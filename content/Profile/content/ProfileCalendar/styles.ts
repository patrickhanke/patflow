import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  calendar_container: {
    flex: 1,
    width: '100%',
    marginTop: 12
  },
  header_container: {
    paddingLeft: 60,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8
  },
  header_scroll_wrapper: {
    flex: 1,
    overflow: 'hidden'
  },
  header_scroll_container: {
    flexDirection: 'row',
    flex: 1
  },
  user_row_wrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginBottom: 8,
    paddingLeft: 64
  },
  avatar_sticky_container: {
    position: 'absolute',
    left: 0,
    width: 60,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  avatar_container: {
    width: 56,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  content_wrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  fixed_column: {
    width: 56,
    marginRight: 8
  },
  scrollable_column: {
    flex: 1
  },
  horizontal_scroll: {
    flex: 1
  },
  header_row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8
  },
  user_column_header: {
    width: 56,
    height: 48,
    marginBottom: 8
  },
  user_avatar_cell: {
    width: 56,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  days_row: {
    flexDirection: 'row',
    gap: 4
  },
  day_header: {
    width: 32,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2
  },
  day_header_text: {
    fontSize: 14,
    fontWeight: '600'
  },
  day_header_weekday: {
    fontSize: 10,
    fontWeight: '400',
    opacity: 0.7
  },
  user_row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    marginBottom: 8
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2
  },
  avatar_text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff'
  },
  day_square: {
    width: 32,
    height: 40,
    // borderRadius: 4,
    overflow: 'hidden'
  },
  day_square_half: {
    width: '50%',
    height: '100%'
  }
});

export default styles;
