import React, { useContext } from 'react';
import { Text, View, Modal } from 'react-native';
import styles from './styles';
import { AppContext } from '../../AppContextProvider';
import { ThemeContext } from '@provider';

const GlobalIndicator = () => {
  const { indicatorContent } = useContext(AppContext);
  const { themeColors } = useContext(ThemeContext);

  const colorHandler = (type: string) => {
    switch (type) {
      case 'loading':
        return {
          background: 'yellow',
          color: themeColors.dark
        };
      case 'error':
        return {
          background: 'red',
          color: themeColors.white
        };

      case 'success':
        return {
          background: 'green',
          color: themeColors.white
        };

      default:
        return {
          background: 'blue',
          color: themeColors.white
        };
    }
  };

  if (indicatorContent.length > 0) {
    return (
      <Modal visible transparent animationType="fade" statusBarTranslucent>
        <View style={styles.modal_container} pointerEvents="box-none">
          {indicatorContent.map(value => (
            <View
              key={value.id}
              style={{
                ...styles.modal,
                backgroundColor: colorHandler(value.type).background
              }}
            >
              <Text
                style={{
                  color: colorHandler(value.type).color
                }}
              >
                {value[value.type]}
              </Text>
            </View>
          ))}
        </View>
      </Modal>
    );
  }

  return null;
};

export default GlobalIndicator;
