import React, { useCallback, useContext } from 'react';
import { Image, Text, View } from 'react-native';
import { Button, TextInput, ThemeContext, useParseAuth } from '@provider';
import styles from './styles';
import logo from './images/logo_patflow.png';
import RNRestart from 'react-native-restart';

const SignIn = () => {
  const { login, loading: authLoading } = useParseAuth();
  const [values, setValues] = React.useState({ email: '', password: '' });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { themeColors, applicationStyles } = useContext(ThemeContext);

  const loginHandler = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      // Use Parse SDK login - handles session, installation, and FCM token
      await login(values.email, values.password);
      RNRestart.restart();
    } catch (loginError: any) {
      console.log('loginError', loginError.message);
      const errorMessage = loginError?.message || '';
      if (
        errorMessage.includes('Invalid username/password') ||
        errorMessage.includes('invalid login parameters')
      ) {
        setError('Falsche E-Mail / Passwort Kombination');
      } else {
        setError('Das Einloggen ist leider fehlgeschlagen');
      }
      setValues({ email: values.email, password: '' });
    }

    setLoading(false);
  }, [values, login]);

  return (
    <View
      style={[
        styles.signInContainer,
        { backgroundColor: themeColors.background }
      ]}
    >
      <View>
        <Image source={logo} style={{ width: 120, height: 120 }} />
      </View>
      <Text style={applicationStyles.medium_header}>Login</Text>
      <View style={{ width: 240, alignItems: 'center' }}>
        <Text style={applicationStyles.label}>E-Mail</Text>
        <TextInput
          defaultValue=""
          placeholder="E-Mail"
          onChange={value => setValues({ ...values, email: value })}
        />
      </View>
      <View style={{ width: 240, alignItems: 'center' }}>
        <Text style={applicationStyles.label}>Passwort</Text>
        <TextInput
          defaultValue=""
          placeholder="Passwort"
          onChange={value => setValues({ ...values, password: value })}
          secureTextEntry
        />
      </View>
      <View>
        {error && <Text style={applicationStyles.error_message}>{error}</Text>}
        <Button
          text={loading || authLoading ? 'Lädt...' : 'Login'}
          onPress={loginHandler}
          disabled={loading || authLoading}
          color={themeColors.primary}
          size="medium"
        />
      </View>
      {/* <Button title="UserData" onPress={getUser} /> */}
    </View>
  );
};

export default SignIn;
