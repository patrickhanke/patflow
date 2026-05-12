import React, { FC, useContext, useState } from 'react';
import { Pressable, View } from 'react-native';
import styles from './styles';
import {
  getDateObject,
  GlobalModal,
  IconDisplay,
  ThemeContext
} from '@provider';
import { TimeDisplayProps } from './types';
import RenderDay from './components/RenderDay';
import { CreateEditWorktime } from '@provider';

const TimeDisplay: FC<TimeDisplayProps> = ({
  days,
  date,
  refetch,
  isEditable,
  holiday,
  record
}) => {
  const { applicationStyles, themeColors } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <View style={[styles.day_container]}>
        <View style={applicationStyles.vertical_container}>
          {holiday && (
            <IconDisplay
              icon="calendar"
              size={15}
              color={themeColors.primary}
              text={holiday}
              fontColor={themeColors.primary}
            />
          )}
          {days.map(day => {
            if (!day) {
              return null;
            }
            if (day.type === 'absence') {
              return (
                <IconDisplay
                  key={day.objectId}
                  icon="vacation"
                  text="Urlaub"
                  size={12}
                  fontColor={themeColors.text}
                  color={themeColors.text}
                />
              );
            }
            if (day.type === 'work') {
              return <RenderDay key={day.objectId} day={day} />;
            }
          })}
        </View>
        {isEditable && (
          <Pressable hitSlop={6} onPress={() => setIsVisible(true)}>
            <IconDisplay
              icon="arrow-right"
              size={15}
              color={themeColors.text}
            />
          </Pressable>
        )}
      </View>
      <GlobalModal
        isVisible={isVisible}
        backHandler={() => setIsVisible(false)}
        dataHasChanged={false}
        title={getDateObject(date).string}
      >
        <CreateEditWorktime
          days={days}
          date={date}
          refetch={refetch}
          records={[record]}
        />
      </GlobalModal>
    </>
  );
};

export default TimeDisplay;
