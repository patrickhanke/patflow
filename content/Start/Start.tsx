import React from 'react';
import { ActivityIndicator, Appearance, Image, View } from 'react-native';
import styles from './styles';
import appLogo from './images/logo_patflow.png';
import appLogoWhite from './images/logo_patflow_white.png';
import { colors } from '@provider';

const Start = () => {
  const colorScheme = Appearance.getColorScheme();

  return (
    <View
      style={[
        styles.main_container,
        {
          backgroundColor:
            colorScheme === 'light'
              ? colors.light.background
              : colors.dark.background
        }
      ]}
    >
      <View style={styles.image_container}>
        {colorScheme === 'light' ? (
          <Image source={appLogo} style={styles.image} />
        ) : (
          <Image source={appLogoWhite} style={styles.image} />
        )}
      </View>
      <View>
        <ActivityIndicator />
      </View>
    </View>
  );
};

export default Start;
