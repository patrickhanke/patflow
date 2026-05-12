import React, { useContext } from 'react';
import { View } from 'react-native';
import {
  convertMillisecondsToString,
  getDateObject,
  IconDisplay,
  ThemeContext
} from '@provider';
import { Day } from '@types';

const RenderDay = ({ day }: { day: Day }) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);

  return (
    <View key={day.objectId} style={applicationStyles.horizontal_container}>
      <IconDisplay
        icon="clock"
        text={`${getDateObject(day?.time?.start).time} - ${getDateObject(day?.time?.end).time}`}
        size={15}
        color={themeColors.text}
        fontColor={themeColors.text}
      />
      <IconDisplay
        icon="time"
        text={
          day?.time
            ? convertMillisecondsToString(day.time.duration - day.time.pause)
            : 'Keine Angabe'
        }
        size={15}
        color={themeColors.text}
        fontColor={themeColors.text}
      />
    </View>
  );
};

export default RenderDay;
