import { StyleSheet } from 'react-native';
import createColor from './createColor';
import { Theme } from '../types';

const applicationStyles = (theme: Theme) =>
  StyleSheet.create({
    loading_container: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: createColor('background', theme)
    },
    button_container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12
    },
    small_shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 3,
        height: -3
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    small_shadow_top: {
      shadowColor: '#000',
      shadowOffset: {
        width: 3,
        height: 3
      },
      shadowOpacity: 0.85,
      shadowRadius: 3.84
    },
    small_container: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      backgroundColor: createColor('background', theme),
      borderWidth: 0.5,
      borderColor: createColor('tertiary', theme)
    },
    large_header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: createColor('text', theme)
    },
    medium_header: {
      fontSize: 20,
      fontWeight: 'bold',
      color: createColor('text', theme)
    },
    small_header: {
      fontSize: 18,
      fontWeight: '500',
      color: createColor('text', theme),
      marginBottom: 6
    },
    text: {
      color: createColor('text', theme),
      fontSize: 16,
      fontWeight: 400
    },
    small_text: {
      color: createColor('light_font', theme),
      fontSize: 15,
      fontWeight: 500
    },
    error_message: {
      color: 'red',
      fontSize: 12
    },
    button_disabled: {
      borderColor: createColor('border', theme),
      color: createColor('text', theme)
    },
    content_container: {
      flex: 1,
      overflow: 'visible',
      backgroundColor: createColor('light_background', theme)
    },
    section_header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 18,
      paddingBottom: 3,
      borderBottomWidth: 1,
      borderColor: createColor('border', theme),
      marginBottom: 0,
      paddingTop: 6,
      color: createColor('text', theme)
    },
    section_header_text: {
      fontSize: 15,
      fontWeight: '600',
      color: createColor('text', theme),
      paddingHorizontal: 12,
      marginTop: 12
    },
    section_container: {
      flex: 1,
      overflow: 'visible'
      // paddingHorizontal: 12
    },
    section_element_container: {
      height: 'auto',
      overflow: 'visible',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: createColor('border', theme),
      borderRadius: 6,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingVertical: 12,
      marginHorizontal: 12,
      gap: 6
    },
    section_bottom_container: {
      width: '100%',
      flexShrink: 0,
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 12,
      backgroundColor: createColor('background', theme),
      shadowOpacity: 1,
      zIndex: 2,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: createColor('border', theme)
    },
    section_top_container: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'stretch',
      width: '100%',
      height: 'auto',
      paddingTop: 6,
      paddingHorizontal: 12,
      paddingBottom: 0,
      backgroundColor: createColor('light_background', theme),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: createColor('border', theme)
    },
    separator: {
      height: 12,
      width: '100%'
    },
    divider: {
      height: 1,
      width: '100%',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: createColor('border', theme),
      marginVertical: 3
    },
    vertical_divider: {
      width: 1,
      height: 'auto',
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: createColor('border', theme),
      marginHorizontal: 3,
      position: 'relative'
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: createColor('text', theme),
      marginBottom: 6,
      marginTop: 6
    },
    horizontal_container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12
    },
    vertical_container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      gap: 6
    },
    text_input: {
      // flexBasis: 40,
      minWidth: '100%',
      borderColor: createColor('border', theme),
      borderWidth: 0.5,
      borderRadius: 6,
      paddingHorizontal: 6,
      color: createColor('text', theme)
    },
    modal: {
      flex: 1,
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(0,0,0,0.2)',
      zIndex: 5,
      elevation: 5
    },
    modal_background: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.2)',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modal_container: {
      width: '80%',
      height: 'auto',
      backgroundColor: createColor('background', theme),
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 18,
      alignItems: 'flex-start',
      gap: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    add_button_container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 18,
      borderTopColor: createColor('border', theme),
      borderTopWidth: 1
    },
    add_button: {
      width: '100%',
      position: 'relative',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: createColor('primary', theme),
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: 'transparent',
      zIndex: 2,
      elevation: 2
    },
    add_button_disabled: {
      width: '100%',
      position: 'relative',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: createColor('disabled', theme),
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: 'transparent',
      zIndex: 2,
      elevation: 2
    },
    add_button_text: {
      color: createColor('button', theme),
      fontSize: 18
    },
    dropdown: {
      position: 'relative',
      minWidth: 150,
      height: 36,
      borderWidth: 0.5,
      borderRadius: 6,
      paddingHorizontal: 12,
      borderColor: createColor('border', theme)
    }
  });

export default applicationStyles;
