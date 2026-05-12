import React, { FC, useContext, useState } from 'react';
import { styles } from '../styles';
import { Text, View } from 'react-native';
import { IconButton } from '../../../Input';
import { NoTimesProps } from '../types';
import { Modal } from '../../../Layout';
import CreateTime from '../content/CreateTime';
import { AppContext, findDefaultTimeForDate, ThemeContext } from '@provider';

const NoTimes: FC<NoTimesProps> = ({ date, refetch, records }) => {
  const { themeColors } = useContext(ThemeContext);
  const { isConnected } = useContext(AppContext);
  const [addTime, setAddTime] = useState(false);
  const [dataHasChanged, setDataHasChanged] = useState(false);

  return (
    <>
      <View style={styles.no_dates_container}>
        <Text style={{ color: themeColors.text }}>
          Für diesen Tag gibt es noch keine Arbeitszeiten
        </Text>
        <IconButton
          icon="add"
          backgroundColor={themeColors.primary}
          color={themeColors.light}
          text={
            !isConnected ? 'Keine Internetverbindung' : 'Arbeitszeit hinzufügen'
          }
          onPress={() => setAddTime(true)}
          disabled={!isConnected}
        />
      </View>
      <Modal
        isVisible={addTime}
        setIsVisible={setAddTime}
        title="Arbeitszeit hinzufügen"
        dataHasChanged={dataHasChanged}
        setDataHasChanged={setDataHasChanged}
      >
        <CreateTime
          date={date}
          initialTime={
            findDefaultTimeForDate(date, records)?.default_time ?? undefined
          }
          refetch={refetch}
          afterSaveHandler={() => {
            setAddTime(false);
          }}
          dataHasChanged={dataHasChanged}
          setDataHasChanged={setDataHasChanged}
        />
      </Modal>
    </>
  );
};

export default NoTimes;
