import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import styles from './styles';
import { ThemeContext } from '@provider';

const NoConnection = () => {
  const { applicationStyles } = useContext(ThemeContext);
  return (
    <View style={styles.no_connection_container}>
      <Text style={applicationStyles.medium_header}>
        Keine Internetverbindung
      </Text>
      <Text style={{ textAlign: 'center' }}>
        Bitte verbinden Sie sich mit dem Internet und versuchen Sie es erneut.
      </Text>
    </View>
  );
};

export default NoConnection;
