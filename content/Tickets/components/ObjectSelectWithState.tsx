import React, { Dispatch, SetStateAction, useContext, useMemo } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { ThemeContext, useDataStore } from '@provider';
import { View } from 'react-native';
import { ObjectSelect, Property } from '@types';

const ObjectSelectWithState = ({
  selectedObject,
  setSelectedObject
}: {
  selectedObject?: ObjectSelect;
  setSelectedObject: Dispatch<SetStateAction<ObjectSelect>>;
}) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const properties = useDataStore(state => state.properties);

  const objectOptions = useMemo(() => {
    const objectOptionsArray: ObjectSelect[] = [];
    if (properties.length > 0) {
      properties.forEach((object: Property) => {
        if (object && object.name) {
          objectOptionsArray.push({
            value: object.objectId,
            id: object.objectId,
            label: object.name
          });
        }
      });
    }
    return objectOptionsArray.sort((a, b) => a.label.localeCompare(b.label));
  }, [properties]);

  return (
    <View style={{ position: 'relative' }}>
      <Dropdown
        dropdownPosition="auto"
        searchField="label"
        inputSearchStyle={{ color: themeColors.text }}
        accessibilityLabel="Objekt auswählen"
        mode="default" // flat or
        maxHeight={300}
        search
        style={applicationStyles.dropdown}
        placeholderStyle={{ color: themeColors.text }}
        itemTextStyle={{ color: themeColors.text }}
        containerStyle={{
          position: 'absolute',
          top: 200,
          borderColor: themeColors.border,
          backgroundColor: themeColors.background,
          borderRadius: 6
        }}
        selectedTextStyle={{ color: themeColors.text }}
        activeColor={themeColors.primary}
        labelField="label"
        valueField="value"
        value={selectedObject}
        data={objectOptions}
        onChange={values => setSelectedObject(values)}
        placeholder={'Objekt auswählen'}
      />
    </View>
  );
};

export default ObjectSelectWithState;
