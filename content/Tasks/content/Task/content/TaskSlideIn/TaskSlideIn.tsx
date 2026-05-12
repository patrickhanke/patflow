import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import {
  AppContext,
  Button,
  Comments,
  CreateComment,
  CreateImages,
  Divider,
  IconDisplay,
  ImageDisplay,
  Modal,
  ThemeContext,
  useSaveImages,
  UserDisplay,
  IconButton,
  useDataHandler,
  getDateObject
} from '@provider';
import styles from './styles';
import { Asset } from 'react-native-image-picker';
import uuid from 'react-native-uuid';
import { Task } from '@types';
import DisplayTicket from './components/DisplayTicket';
import { EditDescription, EditAssignedStaff } from '@content';
import { getWeek } from 'date-fns';

const TaskSlideIn = ({
  task,
  date,
  completeTask,
  refetch,
  isAdmin = false
}: {
  task: Task;
  date: string;
  completeTask: () => void;
  refetch: () => Promise<Task[]>;
  isAdmin?: boolean;
}) => {
  const [imageLoading, setImageLoading] = useState(false);
  const { indicatorHandler, isConnected } = useContext(AppContext);
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const [siteState, setSiteState] = useState('start');
  const [isVisible, setIsVisible] = useState(false);
  const { saveImages } = useSaveImages({ isConnected });
  const { updateData } = useDataHandler();

  const addImagesHandler = useCallback(
    async (images: Asset[]) => {
      setImageLoading(true);
      const indicatorElement = {
        loading: 'Bilder werden hochgeladen',
        error: 'Fehler beim Hochladen',
        success: isConnected
          ? 'Bilder erfolgreich hochgeladen'
          : 'Bilder gespeichert, werden bei Verbindung synchronisiert',
        id: uuid.v4() as string
      };
      indicatorHandler(indicatorElement, 'loading');

      await saveImages({
        assets: images,
        title: task.title,
        taskId: task.objectId
      });

      await refetch();
      indicatorHandler(indicatorElement, 'success');
      setSiteState('start');
      setImageLoading(false);
    },
    [
      saveImages,
      task.objectId,
      task.title,
      isConnected,
      indicatorHandler,
      refetch
    ]
  );

  const updateAssignedStaffHandler = useCallback(
    async (assignedStaff: string[]) => {
      await updateData({
        className: 'Task',
        objectId: task.objectId,
        updateObject: { assigned_staff: assignedStaff }
      });
      await refetch();
    },
    [task.objectId, refetch]
  );

  const updateDescriptionHandler = useCallback(
    async (description: string) => {
      await updateData({
        className: 'Task',
        objectId: task.objectId,
        updateObject: { description: description }
      });
    },
    [task.objectId]
  );

  const dueDateInfo = useMemo(() => {
    if (task?.time?.category?.value === 'opportunity') {
      return {
        header: 'Fällig in ',
        text: `Kalenderwoche ${getWeek(new Date(date), { weekStartsOn: 1 })}`
      };
    }

    const timeDate = task.time?.dates.find(td => td.includes(date));
    return {
      header: 'Fällig am',
      text: timeDate
        ? timeDate.length > 10
          ? `${getDateObject(timeDate).date} - ${getDateObject(timeDate).time}`
          : `${getDateObject(date).date}`
        : `${getDateObject(date).date}`
    };
  }, [task.time, date]);

  return (
    <>
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.slidein_container}
        >
          {/* Title Section */}
          <View style={applicationStyles.horizontal_container}>
            <IconDisplay icon="text" color={themeColors.border} size={21} />
            <View style={{ flex: 1 }}>
              {/* <Text style={applicationStyles.small_header}>Titel</Text> */}
              <Text style={applicationStyles.text} selectable>
                {task?.title}
              </Text>
            </View>
          </View>
          <Divider showLine />

          {/* Due Date Section */}
          <View style={applicationStyles.horizontal_container}>
            <IconDisplay icon="calendar" color={themeColors.border} size={21} />
            <View style={{ flex: 1 }}>
              <Text style={applicationStyles.text}>{dueDateInfo.text}</Text>
            </View>
          </View>
          <Divider showLine />

          {/* Property/Object Section */}
          <View style={applicationStyles.horizontal_container}>
            <IconDisplay icon="building" color={themeColors.border} size={21} />
            <View style={{ flex: 1 }}>
              {/* <Text style={applicationStyles.small_header}>Objekt</Text> */}
              <Text style={applicationStyles.text}>{task?.property?.name}</Text>
            </View>
          </View>

          {/* Description Section */}
          {task.description && isAdmin ? (
            <EditDescription
              initialDescription={task.description}
              saveDescription={updateDescriptionHandler}
            />
          ) : (
            <>
              <Divider showLine />
              <View
                style={{
                  flexDirection: 'row',
                  gap: 12,
                  alignItems: 'flex-start',
                  flex: 1
                }}
              >
                <IconDisplay
                  icon="document"
                  color={themeColors.border}
                  size={21}
                />
                <View style={{ flex: 1 }}>
                  {/* <Text style={applicationStyles.small_header}>
                    Beschreibung
                  </Text> */}
                  <Text style={applicationStyles.text} selectable>
                    {task.description || '-'}
                  </Text>
                </View>
              </View>
            </>
          )}
          <Divider showLine />

          {/* Assigned Staff Section */}
          <View
            style={[
              applicationStyles.horizontal_container,
              { alignItems: 'flex-start' }
            ]}
          >
            <IconDisplay icon="people" color={themeColors.border} size={21} />
            <View style={{ flex: 1 }}>
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 12,
                  paddingTop: 6
                }}
              >
                {task?.assigned_staff.map((userId: string) => (
                  <UserDisplay key={userId} userId={userId} />
                ))}
              </ScrollView>
            </View>
          </View>
          <Divider />
          {isAdmin && (
            <IconButton
              icon="add"
              size="small"
              onPress={() => setSiteState('assignUser')}
              color={themeColors.text}
              text="Arbeiter auswählen"
              backgroundColor={'transparent'}
            />
          )}
          <Divider showLine />

          {/* Images Section */}
          <View
            style={{
              flexDirection: 'column',
              gap: 12,
              alignItems: 'stretch',
              flex: 1
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                gap: 12,
                alignItems: 'flex-start',
                flex: 1
              }}
            >
              <IconDisplay icon="image" color={themeColors.border} size={21} />
              <View style={{ flex: 1 }}>
                <View style={applicationStyles.horizontal_container}>
                  <Text style={applicationStyles.small_header}>Bilder</Text>
                </View>
              </View>
            </View>
            <View style={{ minHeight: 120 }}>
              <ImageDisplay imageIds={task.images} />
            </View>
            <IconButton
              icon="add"
              size="small"
              onPress={() => setSiteState('image')}
              color={themeColors.text}
              text="Bilder hinzufügen"
              backgroundColor={'transparent'}
            />
          </View>
          <Divider showLine />

          {/* Comments Section - Full Width */}
          <View style={{ flex: 1, minHeight: 120 }}>
            <Comments
              comments={task.comments}
              onClick={() => setSiteState('comment')}
              createCommentButton
              scrollEnabled={false}
            />
          </View>

          {/* Ticket Section */}
          {task.ticket && (
            <>
              <Divider showLine />
              <DisplayTicket ticketId={task.ticket.objectId} />
              <Divider showLine />
            </>
          )}
        </ScrollView>
        <View style={{ height: 60, paddingVertical: 12 }}>
          <Pressable
            hitSlop={6}
            onPress={() => setIsVisible(true)}
            style={applicationStyles.add_button}
          >
            <Text style={applicationStyles.add_button_text}>
              Aufgabe abschließen
            </Text>
          </Pressable>
        </View>
      </View>
      <Modal
        isVisible={siteState === 'comment'}
        setIsVisible={() => setSiteState('start')}
        dataHasChanged={false}
      >
        <CreateComment
          id={task.objectId}
          type="task"
          refetch={refetch}
          setShowComments={() => setSiteState('start')}
        />
      </Modal>
      <Modal
        title="Bilder hinzufügen"
        isVisible={siteState === 'image'}
        setIsVisible={() => setSiteState('start')}
        dataHasChanged={false}
      >
        <CreateImages
          onSave={images => addImagesHandler(images)}
          onCancel={() => setSiteState('start')}
          loading={imageLoading}
        />
      </Modal>

      <Modal
        isVisible={isVisible}
        setIsVisible={() => setIsVisible(false)}
        dataHasChanged={false}
        title="Aufgabe abschließen"
      >
        <View
          style={[
            applicationStyles.vertical_container,
            { gap: 24, paddingVertical: 24, paddingHorizontal: 12, flex: 0 }
          ]}
        >
          <Text style={applicationStyles.small_header}>
            Möchten Sie die Aufgabe erledigen?
          </Text>
          <Button
            color={themeColors.border}
            fontColor={themeColors.dark}
            onPress={() => setIsVisible(false)}
            text="Abbrechen"
            size="medium"
          />
          <Button
            color={themeColors.primary}
            fontColor={themeColors.button}
            onPress={() => {
              completeTask();
            }}
            text="Aufgabe erledigt"
            size="medium"
          />
        </View>
      </Modal>

      <EditAssignedStaff
        assignedStaff={task.assigned_staff}
        saveAssignedStaff={updateAssignedStaffHandler}
        isVisible={siteState === 'assignUser'}
        setIsVisible={() => setSiteState('start')}
      />
    </>
  );
};

export default TaskSlideIn;
