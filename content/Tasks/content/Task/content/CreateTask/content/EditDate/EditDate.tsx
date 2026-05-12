import {
  Button,
  Divider,
  IconButton,
  Modal,
  SwitchButtons,
  ThemeContext
} from '@provider';
import React, { FC, useContext, useState } from 'react';
import { Text, View } from 'react-native';
import { EditDateProps } from './types';
import { date_category_options, modi_options } from './constants';
import { DateObject } from '@types';
import SingleDateSelectInterface from './components/SingleDateSelectInterface';
import { MultiDateSelectInterface } from './components';
import styles from './styles';
import removeTimeFromDate from './functions/removeTFromDate';

const defaultDate: DateObject = {
  type: modi_options[0],
  category: date_category_options[0],
  interval: {
    number: 1,
    unit: 'days'
  },
  start_date: '',
  end_date: '',
  dates: [],
  weekday: '',
  time: '',
  next_dates: []
};

const EditDate: FC<EditDateProps> = ({ initialDate, saveDate }) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);
  const [date, setDate] = useState(initialDate || defaultDate);

  return (
    <>
      <View>
        <View style={applicationStyles.horizontal_container}>
          <Text style={applicationStyles.small_header}>Datum auswählen</Text>
          <IconButton
            icon="edit"
            onPress={() => setIsVisible(true)}
            size="medium"
          />
        </View>
        {date.dates.length > 0 && (
          <Text
            style={{
              backgroundColor: themeColors.light_background,
              padding: 6
            }}
          >
            {date.dates
              .map((dateString: string) => {
                const option: {
                  day: 'numeric' | '2-digit';
                  month: 'numeric' | '2-digit';
                  year: 'numeric' | '2-digit';
                  hour?: 'numeric' | '2-digit';
                  minute?: 'numeric' | '2-digit';
                } = {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                };
                if (dateString.includes('T')) {
                  option.hour = '2-digit';
                  option.minute = '2-digit';
                }
                return new Date(dateString).toLocaleDateString('de-DE', option);
              })
              .join(', ')}
          </Text>
        )}
      </View>
      <Modal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        dataHasChanged={false}
        title="Datum bearbeiten"
      >
        <View style={styles.dates_container}>
          <View>
            <Text
              style={[applicationStyles.small_header, { textAlign: 'center' }]}
            >
              Interval wählen
            </Text>
            <SwitchButtons
              buttonStates={modi_options}
              currentState={date.type}
              changeHandler={value =>
                setDate({
                  ...date,
                  type: value as DateObject['type'],
                  dates: []
                })
              }
            />
          </View>
          <Divider />
          <View>
            <Text
              style={[applicationStyles.small_header, { textAlign: 'center' }]}
            >
              Kategorie wählen
            </Text>
            <SwitchButtons
              buttonStates={date_category_options}
              currentState={date.category}
              changeHandler={value =>
                setDate({
                  ...date,
                  category: value as DateObject['category'],
                  dates: []
                })
              }
            />
          </View>
          <Divider />
          <View style={{ flex: 1 }}>
            <Text
              style={[applicationStyles.small_header, { textAlign: 'center' }]}
            >
              Datum auswählen
            </Text>
            {date.type.value === 'single' && (
              <SingleDateSelectInterface
                date={date}
                category={date.category.value}
                onChange={value => setDate({ ...date, dates: value.dates })}
              />
            )}
            {date.type.value === 'multi' && (
              <MultiDateSelectInterface
                date={date}
                category={date.category.value}
                onChange={(newDate: DateObject) =>
                  setDate({ ...date, dates: newDate.dates })
                }
              />
            )}
          </View>
        </View>
        <View>
          <Button
            text={'Speichern'}
            onPress={() => {
              const dateWithNextDates = {
                ...date,
                next_dates: date.dates.map(dateString =>
                  removeTimeFromDate(dateString)
                )
              };
              saveDate(dateWithNextDates);
              setIsVisible(false);
            }}
            size="medium"
            color={themeColors.dark}
          />
        </View>
      </Modal>
    </>
  );
};

export default EditDate;
