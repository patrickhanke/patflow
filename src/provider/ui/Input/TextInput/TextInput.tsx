import React, { useContext, useState } from 'react';
import { TextInput as Input, Keyboard } from 'react-native';

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
  const { applicationStyles } = useContext(ThemeContext);

  return (
    <Input
      style={{
        ...applicationStyles.text_input,
        height: Math.max(35, inputHeight)
      }}
      onChangeText={value => onChange(value)}
      defaultValue={defaultValue}
      placeholder={placeholder}
      keyboardType="default"
      multiline={multiline}
      numberOfLines={4}
      secureTextEntry={secureTextEntry}
      onBlur={() => console.log('blur')}
      onSubmitEditing={() => Keyboard.dismiss()}
      onContentSizeChange={event => {
        setInputHeight(event.nativeEvent.contentSize.height);
      }}
    />
  );
};

export default TextInput;
