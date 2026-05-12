import React, { useContext } from 'react';
import { Text, View } from 'react-native';

import styles from './styles';
import { IconDisplayProps } from './types';
import iconRender from './functions/iconRender';
import { ThemeContext } from '@provider';

const IconDisplay = ({
  icon,
  text,
  size = 15,
  color,
  fontColor,
  backgroundColor
}: IconDisplayProps) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  return (
    <View style={[styles.icon_container, { backgroundColor: backgroundColor }]}>
      {iconRender(icon, size, color || themeColors.light_font)}
      {text && (
        <Text
          lineBreakMode="clip"
          style={[
            applicationStyles.small_text,
            { fontSize: size, color: fontColor || themeColors.light_font }
          ]}
        >
          {text}
        </Text>
      )}
    </View>
  );
};

export default IconDisplay;
