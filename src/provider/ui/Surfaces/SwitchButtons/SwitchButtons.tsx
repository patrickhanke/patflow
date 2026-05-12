import React, { useContext } from 'react';
import { SwitchButtons as SwitchButtonsComponent } from './types';
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
        width: 'auto',
        flex: 0,
        paddingVertical: 8,
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 8,
          width: 'auto',
          paddingHorizontal: 12
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.buttons_container}
      >
        {buttonStates.map(button => (
          <Pressable
            hitSlop={6}
            key={button.value}
            style={[
              styles.switch_button,
              {
                opacity: button.disabled ? 0.5 : 1,
                backgroundColor:
                  currentState.value === button.value
                    ? themeColors.primary
                    : themeColors.light,
                boxShadow:
                  currentState.value === button.value
                    ? `0 3px 6px 0 ${themeColors.primary}80`
                    : 'none'
              }
            ]}
            onPress={() => changeHandler(button)}
            disabled={button.disabled}
          >
            <Text
              style={{
                ...styles.switch_button_text,
                color:
                  currentState.value === button.value
                    ? themeColors.button
                    : themeColors.text
              }}
            >
              {button.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default SwitchButtons;
