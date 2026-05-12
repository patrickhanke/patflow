import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

interface ButtonProps {
  size: 'small' | 'medium' | 'large';
  color: string;
  onPress: () => void;
  text: string;
  disabled?: boolean;
  fontColor?: string;
  borderColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  size,
  color,
  onPress,
  text,
  fontColor,
  disabled = false,
  borderColor = 'transparent'
}) => {
  const styles = StyleSheet.create({
    button: {
      backgroundColor: disabled ? 'gray' : color, // Use gray if disabled, otherwise use provided color
      paddingHorizontal: size === 'small' ? 12 : size === 'medium' ? 18 : 24,
      paddingVertical: size === 'small' ? 6 : size === 'medium' ? 6 : 12,
      borderRadius: size === 'small' ? 6 : size === 'medium' ? 6 : 12,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.5 : 1,
      borderWidth: 1,
      borderColor: borderColor
    },
    text: {
      color: fontColor ? fontColor : 'white',
      fontSize: size === 'small' ? 12 : size === 'medium' ? 15 : 18,
      fontWeight: '600'
    }
  });

  return (
    <Pressable
      hitSlop={6}
      style={styles.button}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

export default Button;
