import { Fragment, useCallback, useContext, useMemo, useState } from 'react';
import ListElement from './components/ListElement';
import { ElementSelectInterfaceProps, SelectElement } from './types';
import { get, set } from 'lodash';
import { Divider, Modal } from '../../Layout';
import { ScrollView, View } from 'react-native';
import { TextInput } from '../TextInput';
import { Button } from '../Button';
import { ThemeContext } from '@provider';

const ElementSelectInterface: React.FC<ElementSelectInterfaceProps> = ({
  title = '',
  elements = [],
  selectedElements,
  onSelect,
  max = 1,
  isSearchable = false,
  selectProperty = false,
  useTiles = false,
  selectAll = false,
  isVisible,
  setIsVisible,
  loading = false,
  onSave,
  disabled = false,
  layer = 1
}) => {
  const [searchInput, setSearchTerm] = useState('');
  const { themeColors } = useContext(ThemeContext);
  const elementChangeHandler = useCallback(
    (element: SelectElement) => {
      console.log({ element });
      const elementsCopy = [...selectedElements];
      console.log({ elementsCopy });
      if (selectProperty) {
        const elementIndex = elementsCopy.findIndex(
          el => el?.value === element.value
        );
        if (elementIndex !== -1) {
          console.log({ element });

          const elementSelectValue = get(
            elementsCopy,
            `[${elementIndex}].selected`,
            false
          );
          set(elementsCopy, `[${elementIndex}].selected`, !elementSelectValue);
        }
        console.log({ elementsCopy });

        onSelect(elementsCopy);
      } else {
        const isSelected = !!elementsCopy.find(
          el => el.value === element.value
        );
        console.log({ isSelected });
        if (isSelected) {
          if (element.single) {
            onSelect([]);
          } else {
            const newElements = elementsCopy.filter(
              el => el.value !== element.value
            );
            onSelect(newElements);
          }
        }

        if (isSelected === false) {
          if (element.single) {
            onSelect([element]);
          } else {
            if (elementsCopy.length < max) {
              elementsCopy.push(element);

              const newElements = elementsCopy.filter(el => !el.single);

              onSelect(newElements);
            }
            if (elementsCopy.length === max) {
              elementsCopy.shift();
              elementsCopy.push(element);
              const newElements = elementsCopy.filter(el => !el.single);

              onSelect(newElements);
            }
          }
        }
      }
    },
    [elements, onSelect, selectedElements]
  );

  const checkForHeader = (
    header: string,
    index: number,
    eleArray: SelectElement[]
  ) => {
    if (!header) {
      return false;
    }

    if (header && index === 0) {
      return true;
    }

    if (header && index > 0) {
      if (eleArray[index - 1]?.header === header) {
        return false;
      }
    }
    return true;
  };

  const filteredElements = useMemo(() => {
    const ele: SelectElement[] = [];
    if (!searchInput) {
      return elements;
    }

    elements.forEach((element: SelectElement) => {
      if (
        Object.values(element)
          .join('')
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      ) {
        ele.push(element);
      }
    });

    return ele;
  }, [elements, selectedElements, searchInput]);

  console.log({ filteredElements, elements });

  return (
    <Modal
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      dataHasChanged={false}
      title={title}
      layer={layer}
    >
      <View>
        {isSearchable && (
          <View>
            <TextInput
              defaultValue={searchInput}
              onChange={e => setSearchTerm(e)}
              placeholder="Suche"
            />
            <Divider />
          </View>
        )}
        {selectAll && (
          <>
            <View>
              <ListElement
                key={'select_all'}
                element={{
                  value: 'select_all',
                  label: 'Alle auswählen'
                }}
                isSelected={selectedElements.length === elements.length}
                onSelect={() => {
                  if (selectedElements.length === elements.length) {
                    onSelect([]);
                  } else {
                    const newElements = elements.filter(
                      (el: SelectElement) => !el.single
                    );
                    onSelect(newElements);
                  }
                }}
                // useTiles={useTiles}
              />
            </View>
            <Divider />
          </>
        )}
        <ScrollView style={{ maxHeight: 400 }} nestedScrollEnabled>
          {filteredElements.map(
            (element: SelectElement, index, ele: SelectElement[]) => (
              <Fragment key={element.value}>
                {checkForHeader(element.header, index, ele) && (
                  <label>{element.header}</label>
                )}
                <ListElement
                  key={element.value}
                  element={element}
                  isSelected={
                    !selectProperty
                      ? selectedElements.some(
                          (el: SelectElement) => el?.value === element.value
                        ) || false
                      : element.selected || false
                  }
                  onSelect={el => elementChangeHandler(el)}
                  useTiles={useTiles}
                />
              </Fragment>
            )
          )}
        </ScrollView>
        <View>
          <Button
            text={loading ? 'Speichert ...' : 'Speichern'}
            color={themeColors.primary}
            onPress={() => onSave(selectedElements)}
            size="medium"
            disabled={loading || disabled}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ElementSelectInterface;
