import {
  ElementSelectInterface,
  SelectElement,
  ThemeContext,
  useDataStore
} from '@provider';
import { UserDisplayData } from '@types';
import React, { useContext, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const UserFilter = ({
  onSelect
}: {
  onSelect: (selectedStaff: string[]) => void;
}) => {
  const { applicationStyles } = useContext(ThemeContext);
  const [selectedStaff, setSelectedStaff] = useState<SelectElement[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const users = useDataStore(state => state.users);

  const elements = useMemo(() => {
    if (users && users.length > 0) {
      return users.map((user: UserDisplayData) => ({
        value: user.objectId,
        label: `${user.first_name} ${user.last_name}`
      }));
    }
    return [];
  }, [users]);

  return (
    <View>
      <Pressable
        onPress={() => setIsOpen(true)}
        style={applicationStyles.add_button}
      >
        <Text style={[applicationStyles.add_button_text, { fontSize: 14 }]}>
          {selectedStaff.length > 0
            ? `Arbeiter filtern (${selectedStaff.length} ausgewählt)`
            : 'Arbeiter filtern'}
        </Text>
      </Pressable>
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
        isVisible={isOpen}
        setIsVisible={setIsOpen}
        onSave={(eles: SelectElement[]) => {
          setSelectedStaff(eles);
          onSelect(eles.map(ele => ele.value));
          setIsOpen(false);
        }}
        loading={false}
      />
    </View>
  );
};

export default UserFilter;
