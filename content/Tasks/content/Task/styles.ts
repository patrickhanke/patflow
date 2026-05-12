import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  task_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 3,
    gap: 12,
    borderRadius: 12,
    marginVertical: 6
  },
  task_content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    overflow: 'visible',
    gap: 8
  },
  task_indicator: {
    width: 12,
    height: '100%'
  },
  task_content_pressable: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 6
  },
  task_header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12
  },
  task_title_section: {
    flex: 1,
    flexDirection: 'column',
    gap: 4
  },
  task_title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22
  },
  task_property: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.7
  },
  task_date_badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  task_month_text: {
    fontSize: 15,
    fontWeight: '600'
  },
  task_date_text: {
    fontSize: 18,
    fontWeight: '600'
  },
  task_staff_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
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
  },
  task_date_container: {
    width: 48,
    height: 'auto',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 0,
    paddingRight: 12
  },
  status_row_container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  }
});

export default styles;
