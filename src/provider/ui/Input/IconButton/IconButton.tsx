import React, { useContext, useMemo } from 'react';
import { Pressable, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityicons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcons from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import styles from './styles';
import { IconButtonProps } from './types';
import { ThemeContext } from '@provider';

const IconButton = ({
  icon,
  onPress,
  text,
  size,
  color,
  backgroundColor,
  disabled = false
}: IconButtonProps) => {
  const { applicationStyles, themeColors } = useContext(ThemeContext);
  const getSize = useMemo(() => {
    if (size === 'small') {
      return {
        ...styles.icon_button,
        iconSize: 15,
        button: styles.icon_button_small,
        text: styles.icon_button_text_small
      };
    }
    return {
      ...styles.icon_button,
      iconSize: 18,
      button: styles.icon_button_medium,
      text: styles.icon_button_text
    };
  }, [size]);

  const renderIcon = useMemo(() => {
    if (icon === 'info') {
      return (
        <Ionicons name="information-circle-outline" size={getSize.iconSize} />
      );
    }
    if (icon === 'state') {
      return (
        <MaterialCommunityicons name="progress-clock" size={getSize.iconSize} />
      );
    }
    if (icon === 'add') {
      return <AntIcons name="plus" size={getSize.iconSize} />;
    }
    if (icon === 'edit') {
      return <Feather name="edit" size={getSize.iconSize} />;
    }
    if (icon === 'delete') {
      return <AntIcons name="delete" size={getSize.iconSize} />;
    }
    return null;
  }, [icon]);

  const iconButtonHandler = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <Pressable
      hitSlop={6}
      style={[
        getSize.button,
        {
          borderColor: color || themeColors.border,
          borderWidth: 1.2,
          backgroundColor: disabled
            ? themeColors.disabled
            : backgroundColor
              ? backgroundColor
              : 'transparent'
        }
      ]}
      onPress={disabled ? undefined : () => iconButtonHandler()}
      disabled={disabled}
    >
      <Text style={[getSize.text, { color: color ? color : themeColors.text }]}>
        {renderIcon}
      </Text>
      {text && (
        <Text
          style={[
            applicationStyles.text,
            color && { color },
            { fontWeight: '400', fontSize: size === 'small' ? 14 : 18 }
          ]}
        >
          {text}
        </Text>
      )}
    </Pressable>
  );
};

export default IconButton;
