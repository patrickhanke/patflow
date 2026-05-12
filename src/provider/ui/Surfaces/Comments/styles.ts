import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  comment_view: {
    flex: 1
  },
  comment_content: {
    flex: 1,
    gap: 12
  },
  comment_footer: {
    flex: 1,
    maxHeight: 100
  },
  comment_button: {
    padding: 12,
    borderRadius: 12
  },
  comment_button_text: {
    fontSize: 18
  },
  create_comment_container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24
  },
  comment_container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  comment_header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    alignItems: 'center',
    paddingBottom: 6,
    marginBottom: 6
  },
  comment_content_icon: {
    marginRight: 10
  },
  comment_content_image: {
    flex: 0.3
  },
  comment_content_text: {
    flex: 1
  }
});

export default styles;
