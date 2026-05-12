import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  create_image_container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 24
  },
  image_container: {
    overflow: 'visible',
    minHeight: 120,
    maxHeight: 240
  },
  multi_images_container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 12
  },
  multi_asset_container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 12,
    overflow: 'visible'
  },
  multi_images_container_overview: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: 12
  },
  image_display_content: {
    // flex: 1,
    position: 'relative',
    width: 'auto',
    height: 'auto',
    overflow: 'hidden',
    margin: 6,
    borderRadius: 6,
    paddingHorizontal: 12
  },
  icons_container: {
    // width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 48
    // backgroundColor: colors.light
  },
  icon_container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9
  },
  image_delete_button: {
    position: 'absolute',
    zIndex: 5,
    // elevation: 5,
    top: 0,
    right: 0,
    padding: 3,
    borderRadius: 12
  },
  pressable_icon: {
    padding: 6,
    borderRadius: 12
  },
  icon: {
    padding: 6
  },
  image: {
    width: 60,
    height: 120,
    resizeMode: 'contain',
    overflow: 'visible',
    borderRadius: 6
  },
  image_edit_icon: {
    position: 'absolute',
    width: 30,
    height: 30,
    zIndex: 3,
    elevation: 3,
    top: 0,
    left: 0,
    borderRadius: 12,
    padding: 3
  },
  image_edit_icon_pressable: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  image_placeholder: {
    height: 80,
    width: 30,
    backgroundColor: 'gray'
  }
});

export default styles;
