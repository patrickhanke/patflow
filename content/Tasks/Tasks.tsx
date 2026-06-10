import React, { useContext, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  SectionList,
  Text,
  View
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  AppContext,
  Divider,
  GlobalModal,
  SwitchButtonElement,
  SwitchButtons,
  ThemeContext,
  useDataStore,
  useFindData
} from '@provider';
import { TaskSection, TaskSectionObject, TasksProps } from './types';
import UserFilter from './components/UserFilter';
import DisplayTask from './components/DisplayTask';
import { CreateTask, Task } from './content';
import sortTasksForList from './functions/sortTasksForList';
import { Task as TaskType } from '@types';
import { getWeek, getYear } from 'date-fns';

const Tasks = ({ route }: TasksProps) => {
  const { user, isConnected } = useContext(AppContext);
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const [createTask, setCreateTask] = useState(false);
  const isAdmin = route?.params?.admin || false;
  const [usersFilter, setUsersFilter] = useState<string[]>([]);
  const [currentWeekKey, setCurrentWeekKey] = useState<string>(() => {
    const now = new Date();
    return `${getYear(now)}-${getWeek(now, { weekStartsOn: 1 })}`;
  });
  const [refreshing, setRefreshing] = useState(false);

  const tasks = useDataStore(state => state.tasks);
  const { loadTasks } = useFindData();

  const reloadDate = React.useCallback(() => {
    const now = new Date();
    const weekKey = `${getYear(now)}-${getWeek(now, { weekStartsOn: 1 })}`;
    if (weekKey !== currentWeekKey) {
      setCurrentWeekKey(weekKey);
    }
  }, [currentWeekKey]);

  useFocusEffect(reloadDate);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      reloadDate();
    }, 600000);

    return () => clearInterval(intervalId);
  }, [reloadDate]);

  const sectionTasksByWeek: TaskSectionObject = useMemo(() => {
    let tasksArray = tasks;
    if (!isAdmin) {
      tasksArray = tasksArray.filter((task: TaskType) =>
        task.assigned_staff.includes(user.objectId)
      );
    } else if (usersFilter.length > 0) {
      tasksArray = tasksArray.filter((task: TaskType) =>
        usersFilter.some((userId: string) =>
          task.assigned_staff.includes(userId)
        )
      );
    }

    const sectionTasks = sortTasksForList(tasksArray);

    const thisWeek: TaskSection = sectionTasks.filter(
      section =>
        section.id === 'this_week' ||
        section.id === 'overdue' ||
        section.id === 'today'
    );
    const nextWeek: TaskSection = sectionTasks.filter(
      section => section.id === 'next_week'
    );
    const afterNextWeek: TaskSection = sectionTasks.filter(
      section => section.id === 'after_next_week'
    );

    return {
      this_week: thisWeek,
      next_week: nextWeek,
      after_next_week: afterNextWeek
    };
  }, [isAdmin, tasks, usersFilter, currentWeekKey, refreshing]);

  const weekNumberHandler = (sectionWeek: TaskSection) => {
    let weekNumber = 0;
    sectionWeek.forEach(section => {
      weekNumber += section?.data?.length || 0;
    });

    return weekNumber.toString();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    reloadDate();
    await loadTasks();
    setRefreshing(false);
  };

  const buttonStates = useMemo(
    () => [
      {
        value: 'this_week',
        label: 'Diese Woche',
        number: weekNumberHandler(sectionTasksByWeek.this_week)
      },
      {
        value: 'next_week',
        label: 'Nächste Woche',
        number: weekNumberHandler(sectionTasksByWeek.next_week)
      },
      {
        value: 'after_next_week',
        label: 'Übernächste Woche',
        number: weekNumberHandler(sectionTasksByWeek.after_next_week)
      }
    ],
    [sectionTasksByWeek]
  );

  const [siteState, setSiteState] = useState<SwitchButtonElement>(
    buttonStates[0]
  );

  return (
    <View style={applicationStyles.content_container}>
      <View style={applicationStyles.section_top_container}>
        {isAdmin && (
          <>
            <UserFilter onSelect={setUsersFilter} />
            <Divider />
          </>
        )}
        <SwitchButtons
          buttonStates={buttonStates}
          currentState={siteState}
          changeHandler={setSiteState}
        />
      </View>
      <View style={applicationStyles.section_container}>
        {sectionTasksByWeek ? (
          <SectionList
            sections={
              sectionTasksByWeek[siteState.value as keyof TaskSectionObject]
            }
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            renderItem={({ item, index, section }) => (
              <Task
                task={item}
                refetch={() => Promise.resolve([])}
                isAdmin={isAdmin}
                isLast={index === section.data.length - 1}
              />
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View style={applicationStyles.section_header}>
                <Text style={applicationStyles.section_header_text}>
                  {title}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={{ color: themeColors.text, marginTop: 18 }}>
            Im Moment keine Aufgaben
          </Text>
        )}
      </View>
      {isAdmin && (
        <View style={applicationStyles.section_bottom_container}>
          <Pressable
            hitSlop={6}
            onPress={() => setCreateTask(true)}
            style={applicationStyles.add_button}
            disabled={!isConnected}
          >
            <Text style={applicationStyles.add_button_text}>
              + Neue Aufgabe erstellen
            </Text>
          </Pressable>
        </View>
      )}
      {isAdmin && (
        <GlobalModal
          backHandler={() => setCreateTask(false)}
          isVisible={createTask}
          dataHasChanged={false}
          title="Neue Aufgabe erstellen"
        >
          <CreateTask closeModal={() => setCreateTask(false)} />
        </GlobalModal>
      )}
      <DisplayTask isAdmin={isAdmin} />
    </View>
  );
};

export default Tasks;
