import { Comment, Task, Ticket } from '@types';
import React, { useContext, useMemo } from 'react';
import { Text, View } from 'react-native';
import { getDateObject, IconDisplay, ThemeContext } from '@provider';
import styles from '../styles';

const TaskStatusRow = ({
  images,
  comments,
  ticket,
  date,
  dateColor,
  time
}: {
  images: string[];
  comments: Comment[];
  ticket?: Ticket;
  date: string;
  dateColor: string;
  time: Task['time'];
}) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);

  const imagesCount = images?.length ?? 0;
  const commentsCount = comments?.length ?? 0;

  const imagesColor =
    imagesCount > 0 ? themeColors.text : themeColors.light_font;
  const commentsColor =
    commentsCount > 0 ? themeColors.text : themeColors.light_font;

  const iconRowStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 2
  };

  const timeText = useMemo(() => {
    if (!time) {
      return null;
    }

    const timeDate = time.dates.find(td => td.includes(date));
    if (!timeDate) {
      return null;
    }
    if (timeDate.length > 10) {
      return getDateObject(timeDate).time;
    }
    return null;
  }, [time, date]);

  return (
    <View style={styles.status_row_container}>
      {time?.category?.value !== 'opportunity' && timeText && (
        <View style={iconRowStyle}>
          <IconDisplay icon="clock" size={15} color={dateColor} />
          <Text style={[applicationStyles.small_text, { color: dateColor }]}>
            {timeText}
          </Text>
        </View>
      )}
      {ticket && (
        <View style={iconRowStyle}>
          <IconDisplay icon="ticket" size={15} color={themeColors.text} />
        </View>
      )}
      <View style={iconRowStyle}>
        {imagesCount > 0 && (
          <Text style={[applicationStyles.small_text, { color: imagesColor }]}>
            {imagesCount}
          </Text>
        )}
        <IconDisplay icon="image" size={15} color={imagesColor} />
      </View>
      <View style={iconRowStyle}>
        {commentsCount > 0 && (
          <Text
            style={[applicationStyles.small_text, { color: commentsColor }]}
          >
            {commentsCount}
          </Text>
        )}
        <IconDisplay icon="comment" size={15} color={commentsColor} />
      </View>
    </View>
  );
};

export default TaskStatusRow;
