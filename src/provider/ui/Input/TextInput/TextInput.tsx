import React, { useContext, useState } from 'react';
import { Pressable, TextInput as Input, Keyboard, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import { TextInputProps } from './types';
import { ThemeContext } from '@provider';

const TextInput = ({
  defaultValue,
  onChange,
  multiline = false,
  placeholder = 'Text hier eingeben',
  secureTextEntry = false
}: TextInputProps) => {
  const [inputHeight, setInputHeight] = useState(40);
  const [text, setText] = useState(defaultValue);
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const { applicationStyles, themeColors } = useContext(ThemeContext);

  const input = (
    <Input
      style={{
        ...applicationStyles.text_input,
        height: Math.max(35, inputHeight),
        ...(secureTextEntry ? { paddingRight: 40 } : null)
      }}
      onChangeText={value => {
        if (secureTextEntry) {
          setText(value);
        }
        onChange(value);
      }}
      defaultValue={secureTextEntry ? undefined : defaultValue}
      value={secureTextEntry ? text : undefined}
      placeholder={placeholder}
      keyboardType="default"
      multiline={multiline}
      numberOfLines={4}
      secureTextEntry={secureTextEntry ? isSecure : false}
      onBlur={() => console.log('blur')}
      onSubmitEditing={() => Keyboard.dismiss()}
      onContentSizeChange={event => {
        setInputHeight(event.nativeEvent.contentSize.height);
      }}
    />
  );

  if (!secureTextEntry) {
    return input;
  }

  return (
    <View style={{ width: '100%', justifyContent: 'center' }}>
      {input}
      <Pressable
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={
          isSecure ? 'Passwort anzeigen' : 'Passwort verbergen'
        }
        onPress={() => setIsSecure(current => !current)}
        style={{
          position: 'absolute',
          right: 8,
          height: Math.max(35, inputHeight),
          justifyContent: 'center'
        }}
      >
        <Feather
          name={isSecure ? 'eye' : 'eye-off'}
          size={18}
          color={themeColors.light_font}
        />
      </Pressable>
    </View>
  );
};

export default TextInput;
