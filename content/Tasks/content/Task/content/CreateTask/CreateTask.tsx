import {
  AppContext,
  Button,
  Divider,
  ThemeContext,
  useDataHandler
} from '@provider';
import { DateObject } from '@types';
import React, { useCallback, useContext, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { CreateTaskUpdateObject } from './types';
import styles from './styles';
import {
  EditAssignedStaff,
  EditDescription,
  EditTitle,
  SelectProperty,
  SelectTicket
} from './components';
import { EditDate } from './content';

const CreateTask = ({ closeModal }: { closeModal: () => void }) => {
  const { createData, updateData } = useDataHandler();
  console.log('create task 2');
  const { user, projectId } = useContext(AppContext);
  const { themeColors } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedStaff, setAssignedStaff] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [date, setDate] = useState<DateObject | undefined>(undefined);
  const [selectedTicket, setSelectedTicket] = useState<string>('');

  const resetStates = () => {
    setTitle('');
    setDescription('');
    setAssignedStaff([]);
    setSelectedProperty('');
    setSelectedTicket('');
    setDate(undefined);
  };

  const createTask = useCallback(async () => {
    setLoading(true);
    if (!date) {
      setLoading(false);
      return;
    }
    const updateObject: CreateTaskUpdateObject = {
      title: title,
      created_by: {
        __type: 'Pointer',
        className: '_User',
        objectId: user?.objectId
      },
      description: description,
      documents: [],
      state: 'assigned',
      assigned_staff: assignedStaff,
      comments: [],
      images: [],
      type: date.type.value,
      category: date.category.value,
      dates: date.next_dates,
      time: date,
      project: {
        __type: 'Pointer',
        className: 'Project',
        objectId: projectId as string
      }
    };

    if (selectedTicket) {
      updateObject.ticket = {
        __type: 'Pointer',
        className: 'Ticket',
        objectId: selectedTicket
      };
    }

    if (selectedProperty) {
      updateObject.property = {
        __type: 'Pointer',
        className: 'Property',
        objectId: selectedProperty
      };
    }

    await createData({
      className: 'Task',
      updateObject,
      feedback: 'Aufgabe erfolgreich erstellt',
      async afterSaveHandler(objectId: string) {
        if (selectedTicket) {
          await updateData({
            className: 'Ticket',
            objectId: selectedTicket,
            updateObject: {
              task: {
                __type: 'Pointer',
                className: 'Task',
                objectId: objectId
              }
            }
          });
        }
      }
    }).catch(error => {
      console.log(error);
      setLoading(false);
    });

    resetStates();
    setLoading(false);
    closeModal();
  }, [
    title,
    description,
    assignedStaff,
    selectedProperty,
    selectedTicket,
    date,
    projectId,
    user
  ]);

  const buttonDisabled =
    loading || !title || !assignedStaff || !selectedProperty || !date;

  return (
    <View style={styles.slidein_container}>
      <ScrollView contentContainerStyle={styles.scroll_container}>
        <EditTitle title={title} setTitle={setTitle} />
        <View>
          <EditDescription
            initialDescription={description}
            saveDescription={setDescription}
          />
        </View>
        <Divider />
        <EditAssignedStaff
          assignedStaff={assignedStaff}
          saveAssignedStaff={setAssignedStaff}
        />
        <Divider />
        <SelectProperty
          selectedProperty={selectedProperty}
          saveSelectedProperty={setSelectedProperty}
        />
        <Divider />
        <SelectTicket
          selectedTicket={selectedTicket}
          saveSelectedTicket={setSelectedTicket}
        />
        <Divider />
        <EditDate initialDate={date} saveDate={setDate} />
        <Divider />
      </ScrollView>
      <Button
        text={loading ? 'Speichern...' : 'Aufgabe speichern'}
        disabled={buttonDisabled}
        onPress={createTask}
        size="medium"
        color={themeColors.primary}
      />
    </View>
  );
};

export default CreateTask;
