import {
  ElementSelectInterface,
  IconButton,
  IconDisplay,
  SelectElement,
  ThemeContext,
  useDataStore
} from '@provider';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SelectPropertyProps } from '../types';
import { Property } from '@types';
import styles from '../styles';

const SelectProperty: React.FC<SelectPropertyProps> = ({
  selectedProperty,
  saveSelectedProperty
}) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const [editProperty, setEditProperty] = useState(false);
  const properties = useDataStore(state => state.properties);

  const elements = useMemo(() => {
    if (properties.length > 0) {
      return properties
        .sort((a: Property, b: Property) => a.name.localeCompare(b.name))
        .map((property: Property) => ({
          value: property.objectId,
          label: `${property.name}`
        }));
    }
    return [];
  }, [properties]);

  const [selectedPropertyElement, setSelectedPropertyElement] = useState<
    SelectElement | null | undefined
  >(
    selectedProperty
      ? elements.find(
          (element: SelectElement) => element.value === selectedProperty
        )
      : null
  );

  useEffect(() => {
    if (elements && selectedPropertyElement === null) {
      const propertyElement = elements.find(
        (element: SelectElement) => element.value === selectedProperty
      );
      if (propertyElement) {
        setSelectedPropertyElement(propertyElement);
      }
    }
  }, [elements]);

  return (
    <>
      <View style={applicationStyles.horizontal_container}>
        <Text style={applicationStyles.small_header}>Objekt auswählen</Text>
        <IconButton
          icon="edit"
          onPress={() => setEditProperty(true)}
          size="medium"
        />
      </View>
      <View style={styles.user_container}>
        <IconDisplay
          icon="property"
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
          <Text>{selectedPropertyElement?.label}</Text>
        </ScrollView>
      </View>
      <ElementSelectInterface
        elements={elements}
        title="Objekt auswählen"
        selectAll={false}
        selectProperty={false}
        onSelect={eles => {
          setSelectedPropertyElement(eles[0]);
        }}
        selectedElements={
          selectedPropertyElement ? [selectedPropertyElement] : []
        }
        isSearchable
        max={1}
        isVisible={editProperty}
        setIsVisible={setEditProperty}
        onSave={() => {
          if (selectedPropertyElement) {
            saveSelectedProperty(selectedPropertyElement.value);
          }
          setEditProperty(false);
        }}
        loading={false}
        disabled={
          !selectedPropertyElement ||
          selectedPropertyElement.value === selectedProperty
        }
      />
    </>
  );
};

export default SelectProperty;
