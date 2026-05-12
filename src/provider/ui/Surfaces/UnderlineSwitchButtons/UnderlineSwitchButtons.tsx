import React, { useContext } from 'react';
import { UnderlineSwitchButtons as SwitchButtonsComponent } from './types';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ThemeContext } from '@provider';
import styles from './styles';

const SwitchButtons = ({
  buttonStates,
  currentState,
  changeHandler
}: SwitchButtonsComponent) => {
  const { themeColors } = useContext(ThemeContext);
  return (
    <View
      style={{
        width: '100%',
        flex: 0,
        height: 36,
        // paddingVertical: 3,
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <ScrollView
        contentContainerStyle={[styles.buttons_container, { minWidth: '100%' }]}
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        {buttonStates.map(button => (
          <Pressable
            hitSlop={6}
            key={button.value}
            style={[
              styles.switch_button,
              {
                borderColor:
                  currentState.value === button.value
                    ? themeColors.primary
                    : themeColors.light_font
              }
            ]}
            onPress={() => changeHandler(button)}
          >
            <Text
              style={{
                ...styles.switch_button_text,
                color:
                  currentState.value === button.value
                    ? themeColors.primary
                    : themeColors.light_font
              }}
            >
              {button.label}
            </Text>
            {button.number && (
              <View style={[styles.number_indicator]}>
                <Text
                  style={{
                    fontWeight: 500,
                    fontSize: 13,
                    color:
                      currentState.value === button.value
                        ? themeColors.primary
                        : themeColors.light_font
                  }}
                >
                  {button.number.toString() || 1}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default SwitchButtons;
