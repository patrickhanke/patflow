import { TextInput, ThemeContext } from '@provider';
import React, { useContext } from 'react';
import { Text } from 'react-native';

const EditTitle = ({
  title,
  setTitle
}: {
  title: string;
  setTitle: (title: string) => void;
}) => {
  const { applicationStyles } = useContext(ThemeContext);
  return (
    <>
      <Text style={applicationStyles.small_header}>Name der Aufgabe</Text>
      <TextInput
        placeholder="Name der Aufgabe"
        defaultValue={title}
        onChange={value => setTitle(value)}
      />
    </>
  );
};

export default EditTitle;
