import React, { FC, useCallback, useContext, useState } from 'react';
import {
  convertMillisecondsToString,
  Divider,
  getDateObject,
  IconButton,
  Modal,
  ThemeContext,
  useDataHandler
} from '@provider';
import { Alert, Text, View } from 'react-native';
import { TimeProps } from '../types';
import styles from '../styles';
import CreateTime from '../../CreateTime';

const Time: FC<TimeProps> = ({ day, refetch }) => {
  const { applicationStyles, themeColors, theme } = useContext(ThemeContext);
  const [editTime, setEditTime] = useState(false);
  const { deleteData } = useDataHandler();
  const [dataHasChanged, setDataHasChanged] = useState(false);

  const deleteHandler = useCallback(() => {
    Alert.alert(
      'Zeit löschen verwerfen',
      'Sind Sie sicher, dass Sie die Zeit löschen wollen?',
      [
        {
          text: 'Abbrechen',
          onPress: () => null,
          style: 'cancel'
        },
        {
          text: 'Löschen',
          onPress: async () => {
            await deleteData({ className: 'Day', objectId: day.objectId });
            refetch();
          }
        }
      ],
      {
        userInterfaceStyle: theme === 'dark' ? 'dark' : 'light'
      }
    );
  }, []);

  return (
    <>
      <View style={{ flex: 1 }} key={day.objectId}>
        <View style={applicationStyles.section_element_container}>
          <View style={styles.time_container}>
            <View style={applicationStyles.horizontal_container}>
              <Text style={{ color: themeColors.text }}>{'Start'}</Text>
              <Text
                style={{
                  color: themeColors.text
                }}
              >{`${getDateObject(day?.time?.start).time}`}</Text>
            </View>
            <View style={applicationStyles.horizontal_container}>
              <Text style={{ color: themeColors.text }}>{'Ende'}</Text>
              <Text
                style={{
                  color: themeColors.text
                }}
              >{`${getDateObject(day?.time?.end).time}`}</Text>
            </View>
            <View style={applicationStyles.horizontal_container}>
              <Text style={{ color: themeColors.text }}>{'Pause'}</Text>
              <Text
                style={{
                  color: themeColors.text
                }}
              >{`${convertMillisecondsToString(day?.time?.pause || 0)}`}</Text>
            </View>
            <View style={applicationStyles.horizontal_container}>
              <Text style={{ color: themeColors.text }}>{'Dauer'}</Text>
              <Text
                style={{
                  color: themeColors.text
                }}
              >{`${convertMillisecondsToString(day?.time?.duration || 0)}`}</Text>
            </View>
            <Divider />
            <View style={applicationStyles.horizontal_container}>
              <IconButton
                size="small"
                icon="edit"
                text="Zeit Bearbeiten"
                color={themeColors.primary}
                onPress={() => {
                  setEditTime(true);
                }}
              />
              <IconButton
                size="small"
                icon="info"
                color={themeColors.red}
                text="Zeit löschen"
                onPress={() => {
                  deleteHandler();
                }}
              />
            </View>
          </View>
        </View>
      </View>
      <Modal
        isVisible={editTime}
        setIsVisible={setEditTime}
        title="Arbeitszeit hinzufügen"
        dataHasChanged={dataHasChanged}
        setDataHasChanged={setDataHasChanged}
      >
        <CreateTime
          initialTime={day.time || undefined}
          date={day.date}
          id={day.objectId as string}
          refetch={refetch}
          afterSaveHandler={() => {
            setEditTime(false);
            setDataHasChanged(false);
          }}
          dataHasChanged={dataHasChanged}
          setDataHasChanged={setDataHasChanged}
        />
      </Modal>
    </>
  );
};

export default Time;
