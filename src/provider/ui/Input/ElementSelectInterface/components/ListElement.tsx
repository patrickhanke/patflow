import { FC } from 'react';
import { ListElementProps } from '../types';
import { Pressable, Text } from 'react-native';
import Feather from '@react-native-vector-icons/feather';

const ListElement: FC<ListElementProps> = ({
  element,
  isSelected,
  onSelect,
  useTiles = false
}) => {
  return (
    <>
      <Pressable
        data-tile={useTiles}
        data-selected={isSelected}
        onPress={() => onSelect(element)}
        disabled={element.disabled || false}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 6,
          paddingVertical: 12
        }}
      >
        <Feather
          name={isSelected ? 'check-circle' : 'circle'}
          size={30}
          color={isSelected ? 'green' : 'gray'}
        />
        {element.element ? (
          element.element
        ) : (
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: isSelected ? 'green' : 'gray'
            }}
          >
            {element.label}
          </Text>
        )}
      </Pressable>
    </>
  );
};

export default ListElement;
