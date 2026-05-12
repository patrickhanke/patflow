import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef
} from 'react';
import {
  Alert,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View
} from 'react-native';
import styles from './styles';
import { useBackHandler } from '@react-native-community/hooks';
import { iconRender, ThemeContext } from '@provider';

const CustomModal = ({
  isVisible,
  setIsVisible,
  dataHasChanged,
  children,
  title,
  setDataHasChanged,
  layer = 1
}: {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  dataHasChanged: boolean;
  children: React.ReactNode;
  title?: string;
  setDataHasChanged?: Dispatch<SetStateAction<boolean>>;
  layer?: 1 | 2 | 3 | 4;
}) => {
  const { themeColors, theme, applicationStyles } = useContext(ThemeContext);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity 0
  const translateYAnim = useRef(new Animated.Value(100)).current; // Initial position off screen bottom
  const keyboardHeightAnim = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = React.useState(isVisible);

  useBackHandler(() => {
    outsideClickHandler();
    return true;
    // let the default thing happen
  });

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', e => {
      Animated.timing(keyboardHeightAnim, {
        toValue: e.endCoordinates.height,
        duration: 250,
        useNativeDriver: false
      }).start();
    });
    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', () => {
      Animated.timing(keyboardHeightAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false
      }).start();
    });
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', e => {
      Animated.timing(keyboardHeightAnim, {
        toValue: e.endCoordinates.height,
        duration: 100,
        useNativeDriver: false
      }).start();
    });
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(keyboardHeightAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false
      }).start();
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, [keyboardHeightAnim]);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      // Fade in and slide up from bottom
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,

          useNativeDriver: true
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
    } else {
      // Fade out and slide down
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          delay: 300,
          useNativeDriver: true
        }),
        Animated.timing(translateYAnim, {
          toValue: 800,
          duration: 200,
          useNativeDriver: true
        })
      ]).start(() => {
        setShouldRender(false);
      });
    }
  }, [fadeAnim, translateYAnim, isVisible]);

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
          {
            text: 'Schließen',
            onPress: () => {
              if (setDataHasChanged) {
                setDataHasChanged(false);
              }

              setIsVisible(false);
            }
          }
        ],
        {
          userInterfaceStyle: theme === 'dark' ? 'dark' : 'light'
        }
      );
    } else {
      if (setDataHasChanged) {
        setDataHasChanged(false);
      }
      setIsVisible(false);
    }
  }, [dataHasChanged, setIsVisible, theme]);

  return shouldRender ? (
    <Modal
      visible={true}
      transparent={true}
      animationType="none"
      onRequestClose={outsideClickHandler}
    >
      <>
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              opacity: fadeAnim,
              zIndex: 10
            }
          ]}
        />

        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              justifyContent: 'flex-end',
              zIndex: 20 + layer
            }
          ]}
        >
          <Animated.View
            style={[
              styles.modal,
              {
                opacity: fadeAnim,
                transform: [{ translateY: translateYAnim }],
                width: '100%',
                backgroundColor: themeColors.background
              }
            ]}
          >
            <View style={[styles.header, { borderColor: themeColors.border }]}>
              {title && (
                <Text style={applicationStyles.small_header}>{title}</Text>
              )}
              <Pressable hitSlop={6} onPress={() => outsideClickHandler()}>
                <Text>{iconRender('close', 24, themeColors.text)}</Text>
              </Pressable>
            </View>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{
                paddingTop: 12,
                paddingHorizontal: 12,
                paddingBottom: 12,
                position: 'relative'
              }}
            >
              {children}
            </KeyboardAvoidingView>
          </Animated.View>
        </Animated.View>
      </>
    </Modal>
  ) : null;
};

export default CustomModal;
