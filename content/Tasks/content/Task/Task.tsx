import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { TaskProps } from './types';
import { Avatar, GlobalModal, ThemeContext, useDataHandler } from '@provider';
import { TaskSlideIn } from './content';
import styles from './styles';
import { cloneDeep } from 'lodash';
import TaskStatusRow from './components/TaskStatusRow';
import { getWeek, getYear } from 'date-fns';

const Task = ({ task, refetch, isAdmin = false, isLast }: TaskProps) => {
  const { updateData } = useDataHandler();
  const { applicationStyles, themeColors } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);

  const completeTask = useCallback(async () => {
    const taskDatesCopy = cloneDeep(task.dates);
    taskDatesCopy.splice(0, 1);

    await updateData({
      className: 'Task',
      objectId: task.objectId,
      updateObject: {
        dates: taskDatesCopy
      },
      feedback: 'Aufgabe erfolgreich als erledigt markiert'
    });
    setIsVisible(false);
  }, [task.dates, task.objectId, updateData, refetch]);

  const dueDateInfo = useMemo(() => {
    if (task?.time?.category?.value === 'opportunity') {
      const thisYear = getYear(new Date());
      const year = getYear(new Date(task.date));
      const thisWeek = getWeek(new Date(), { weekStartsOn: 1 });
      const week = getWeek(new Date(task.date), { weekStartsOn: 1 });

      let isOverdue = false;

      if (thisYear === year) {
        if (thisWeek > week) {
          isOverdue = true;
        }
      } else if (thisYear > year) {
        isOverdue = true;
      } else if (thisYear < year) {
        isOverdue = false;
      }

      return {
        text: `KW ${getWeek(new Date(task.date), { weekStartsOn: 1 })}`,
        isOverdue: isOverdue,
        backgroundColor: themeColors.light,
        textColor: isOverdue ? themeColors.red : themeColors.blue,
        day: week.toString(),
        month: 'KW'
      };
    }
    if (!task.date) return null;
    const date = new Date(task.date).getTime();
    const now = new Date().getTime();
    const isOverdue = date < now;

    const month = new Date(date).toLocaleDateString('de-DE', {
      month: 'short'
    });
    const day = new Date(date).getDate();

    return {
      text: `${day}. ${month}`,
      isOverdue,
      backgroundColor: isOverdue ? themeColors.secondary : themeColors.light,
      textColor: isOverdue ? themeColors.red : themeColors.text,
      day: day,
      month: month
    };
  }, [task.date, themeColors]);

  // Get first 3 staff members for avatars
  const displayStaff = useMemo(() => {
    return task.assigned_staff.slice(0, 5);
  }, [task.assigned_staff]);

  const remainingCount = useMemo(() => {
    return task.assigned_staff.length - 5;
  }, [task.assigned_staff]);

  return (
    <>
      <Pressable
        style={[
          applicationStyles.section_element_container,
          { borderBottomWidth: isLast ? 0 : 1 }
        ]}
        onPress={() => setIsVisible(true)}
      >
        <View style={styles.task_date_container}>
          {dueDateInfo && (
            <>
              <Text
                style={[
                  styles.task_month_text,
                  { color: dueDateInfo.textColor }
                ]}
              >
                {dueDateInfo.month}
              </Text>
              <Text
                style={[
                  styles.task_date_text,
                  { color: dueDateInfo.textColor }
                ]}
              >
                {dueDateInfo.day}
              </Text>
            </>
          )}
        </View>
        <View style={styles.task_content}>
          <View style={styles.task_header}>
            <View style={styles.task_title_section}>
              <Text style={[styles.task_title, { color: themeColors.text }]}>
                {task?.title}
              </Text>
              <Text style={[styles.task_property, { color: themeColors.text }]}>
                {task?.property?.name || '-'}
              </Text>
            </View>
          </View>

          <View style={styles.task_staff_row}>
            <View style={styles.staff_avatars_container}>
              {displayStaff.map((userId, index) => (
                <Avatar
                  key={userId}
                  userId={userId}
                  isFirst={index === 0}
                  borderColor={themeColors.white}
                />
              ))}
              {remainingCount > 0 && (
                <View style={[styles.avatar_wrapper]}>
                  <View
                    style={[
                      styles.avatar_count,
                      {
                        backgroundColor: themeColors.light,
                        borderColor: themeColors.white
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.avatar_count_text,
                        { color: themeColors.dark_font }
                      ]}
                    >
                      +{remainingCount}
                    </Text>
                  </View>
                </View>
              )}
            </View>
            <View style={applicationStyles.horizontal_container}>
              <TaskStatusRow
                images={task.images}
                comments={task.comments}
                date={task.date}
                time={task.time}
                ticket={task.ticket}
                dateColor={dueDateInfo?.textColor ?? themeColors.text}
              />
            </View>
          </View>
        </View>
      </Pressable>

      <GlobalModal
        title={task.title}
        isVisible={isVisible}
        dataHasChanged={false}
        backHandler={() => {
          setIsVisible(false);
        }}
      >
        <TaskSlideIn
          task={task}
          date={task.date}
          completeTask={completeTask}
          refetch={refetch}
          isAdmin={isAdmin}
        />
      </GlobalModal>
    </>
  );
};

export default Task;
