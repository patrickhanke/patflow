import { Button, IconButton, Modal, TextInput, ThemeContext } from '@provider';
import React, { FC, useContext, useState } from 'react';
import { EditDescriptionProps } from '../types';
import { Text, View } from 'react-native';

const EditDescription: FC<EditDescriptionProps> = ({
  initialDescription,
  saveDescription
}) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);
  const [description, setDescription] = useState(initialDescription);
  return (
    <>
      <View style={applicationStyles.horizontal_container}>
        <Text style={applicationStyles.small_header}>Beschreibung</Text>
        <View style={{ marginLeft: 12 }}>
          <IconButton
            icon="edit"
            onPress={() => setIsVisible(true)}
            size="medium"
          />
        </View>
      </View>
      {description && (
        <Text
          style={{ backgroundColor: themeColors.light_background, padding: 6 }}
        >
          {description}
        </Text>
      )}
      <Modal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        dataHasChanged={false}
        title="Beschreibung bearbeiten"
      >
        <View style={{ flex: 1 }}>
          <Text style={applicationStyles.small_header}>
            Beschreibung bearbeiten
          </Text>
          <TextInput
            multiline
            defaultValue={description}
            onChange={e => setDescription(e)}
          />
        </View>
        <Button
          text={'Speichern'}
          onPress={() => {
            saveDescription(description);
            setIsVisible(false);
          }}
          size="medium"
          color={themeColors.dark}
        />
      </Modal>
    </>
  );
};

export default EditDescription;
