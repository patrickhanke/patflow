import React, { FC, useContext } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { ThemeContext } from '@provider';
import styles from '../styles';
import { DataHasChangedMessageProps } from '../types';

const DataHasChangedMessage: FC<DataHasChangedMessageProps> = ({
  dataHasChanged,
  closeModal,
  setCloseModal,
  setIsVisible
}) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);

  if (dataHasChanged) {
    return (
      <Modal visible={closeModal} animationType="fade" transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText, { color: themeColors.text }]}>
              Sind Sie sicher, dass Sie das Fenster schließen möchten
            </Text>
            <View style={applicationStyles.button_container}>
              <Pressable
                hitSlop={6}
                style={[styles.button, styles.buttonClose]}
                onPress={() => setCloseModal(false)}
              >
                <Text style={[styles.textStyle, { color: themeColors.text }]}>
                  Abbrechen
                </Text>
              </Pressable>
              <Pressable
                hitSlop={6}
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setCloseModal(false);
                  setIsVisible(false);
                }}
              >
                <Text style={[styles.textStyle, { color: themeColors.text }]}>
                  Bestätigen
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
  return null;
};

export default DataHasChangedMessage;
