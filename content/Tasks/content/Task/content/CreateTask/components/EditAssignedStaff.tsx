import {
  ElementSelectInterface,
  IconButton,
  IconDisplay,
  SelectElement,
  ThemeContext,
  UserDisplay,
  useDataStore
} from '@provider';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { EditAssignedStaffProps } from '../types';
import { UserDisplayData } from '@types';
import styles from '../styles';

const getSelectElement = (userId: string): SelectElement => ({
  value: userId,
  label: userId,
  element: <UserDisplay userId={userId} />
});

const EditAssignedStaff: React.FC<EditAssignedStaffProps> = ({
  assignedStaff,
  saveAssignedStaff,
  isVisible,
  setIsVisible
}) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const [editStaff, setEditStaff] = useState(false);

  const users = useDataStore(state => state.users);
  const [selectedStaff, setSelectedStaff] = useState<SelectElement[]>(
    assignedStaff.map(staff => getSelectElement(staff))
  );

  const elements = useMemo(() => {
    if (users.length > 0) {
      return users.map((user: UserDisplayData) => ({
        value: user.objectId,
        label: `${user.first_name} ${user.last_name}`
      }));
    }
    return [];
  }, [users]);

  useEffect(() => {
    if (elements && selectedStaff.length === 0) {
      const elementArray: SelectElement[] = [];
      elements.forEach((element: SelectElement) => {
        if (assignedStaff.includes(element.value)) {
          elementArray.push(element);
        }
      });
      setSelectedStaff(elementArray);
    }
  }, [elements]);

  return (
    <>
      {!isVisible && !setIsVisible && (
        <>
          <View style={applicationStyles.horizontal_container}>
            <Text style={applicationStyles.small_header}>
              Arbeiter auswählen
            </Text>
            <IconButton
              icon="edit"
              onPress={() => setEditStaff(true)}
              size="medium"
            />
          </View>
          <View style={styles.user_container}>
            <IconDisplay
              icon="user"
              color={themeColors.text}
              fontColor={themeColors.text}
              size={18}
            />
            <ScrollView
              style={{ flex: 1, marginLeft: 12 }}
              contentContainerStyle={{
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 6,
                paddingVertical: 3
              }}
              horizontal
            >
              {assignedStaff.map((userId: string) => (
                <UserDisplay key={userId} userId={userId} />
              ))}
            </ScrollView>
          </View>
        </>
      )}
      <ElementSelectInterface
        elements={elements}
        title="Arbeiter auswählen"
        selectAll={false}
        selectProperty={false}
        onSelect={eles => {
          setSelectedStaff(eles);
        }}
        selectedElements={selectedStaff}
        isSearchable
        max={100}
        isVisible={isVisible || editStaff}
        setIsVisible={setIsVisible ? setIsVisible : setEditStaff}
        onSave={() => {
          saveAssignedStaff(selectedStaff.map(staff => staff.value));
          if (setIsVisible) {
            setIsVisible(false);
          }
          setEditStaff(false);
        }}
        loading={false}
      />
    </>
  );
};

export default EditAssignedStaff;
