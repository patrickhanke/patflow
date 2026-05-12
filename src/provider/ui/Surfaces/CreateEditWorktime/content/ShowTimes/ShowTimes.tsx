import React, { FC, useContext, useState } from 'react';
import { ShowTimesProps } from './types';
import { ScrollView, View } from 'react-native';
import {
  findDefaultTimeForDate,
  Divider,
  IconButton,
  Modal,
  ThemeContext
} from '@provider';
import Time from './components/Time';
import CreateTime from '../CreateTime';

const ShowTimes: FC<ShowTimesProps> = ({ days, refetch, date, records }) => {
  const [addTime, setAddTime] = useState(false);
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const { themeColors } = useContext(ThemeContext);

  return (
    <ScrollView>
      {days.slice(0, 3).map(day => (
        <Time day={day} key={day.objectId} refetch={refetch} />
      ))}
      <View>
        <Divider />
        <IconButton
          icon="add"
          backgroundColor={themeColors.primary}
          color={themeColors.light}
          text="Arbeitszeit hinzufügen"
          onPress={() => setAddTime(true)}
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
          initialTime={
            findDefaultTimeForDate(date, records).default_time ?? undefined
          }
          date={date}
          refetch={refetch}
          afterSaveHandler={() => {
            setAddTime(false);
          }}
          dataHasChanged={dataHasChanged}
          setDataHasChanged={setDataHasChanged}
        />
      </Modal>
    </ScrollView>
  );
};

export default ShowTimes;
