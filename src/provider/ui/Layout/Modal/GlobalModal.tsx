import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View
} from 'react-native';
import { iconRender, ThemeContext } from '@provider';
import styles from './globalModalStyles';
import { ModalProps } from './types';
import { useBackHandler } from '@react-native-community/hooks';

const GlobalModal: FC<ModalProps> = ({
  isVisible,
  children,
  dataHasChanged,
  backHandler,
  title
}) => {
  const { themeColors, theme, applicationStyles } = useContext(ThemeContext);
  const [shouldRender, setShouldRender] = useState(isVisible);
  const slideAnim = useRef(new Animated.Value(500)).current; // Initial position off screen right

  useBackHandler(() => {
    outsideClickHandler();
    return true;
    // let the default thing happen
  });

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      // Slide in from right
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true
      }).start();
    } else {
      // Slide out to right
      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 600,
        useNativeDriver: true
      }).start(() => {
        setShouldRender(false);
      });
    }
  }, [slideAnim, isVisible]);

  const outsideClickHandler = useCallback(() => {
    if (dataHasChanged) {
      Alert.alert(
        'Eingabe verwerfen',
        'Sind Sie sicher, dass Sie die Eingabe verwerfen und die Oberfläche schließen wollen?',
        [
          {
            text: 'Abbrechen',
            onPress: () => null,
            style: 'cancel'
          },
          { text: 'Schließen', onPress: () => backHandler(false) }
        ],
        {
          userInterfaceStyle: theme === 'dark' ? 'dark' : 'light'
        }
      );
    } else {
      return backHandler(false);
    }
  }, [dataHasChanged, backHandler, theme]);

  return shouldRender ? (
    <Modal
      visible={true}
      transparent={true}
      animationType="none"
      onRequestClose={backHandler}
    >
      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: themeColors.background,
              borderColor: themeColors.border
            }
          ]}
        >
          <Pressable hitSlop={6} onPress={() => outsideClickHandler()}>
            <Text style={{ color: themeColors.text }}>
              {iconRender('arrow-left', 24, themeColors.text)}
            </Text>
          </Pressable>
          <Text
            style={[applicationStyles.small_header, { marginBottom: 0 }]}
            selectable
          >
            {title
              ? title.length > 30
                ? `${title.slice(0, 30)}...`
                : title
              : ''}
          </Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[
            styles.modalContent,
            { backgroundColor: themeColors.background }
          ]}
        >
          {children}
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  ) : null;
};

export default GlobalModal;
