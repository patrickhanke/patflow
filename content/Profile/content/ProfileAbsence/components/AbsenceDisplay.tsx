import { getDateObject, IconDisplay, ThemeContext } from '@provider';
import { Absence } from '@types';
import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import absence_type_options from '../constants/absence_type_options';
import { transformToColor } from '@provider';
import absence_state_options from '../constants/absence_state_options';
import styles from '../styles';

const AbsenceDisplay = ({ absence }: { absence: Absence }) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);

  return (
    <View style={applicationStyles.section_element_container}>
      <View style={styles.profile_absence_content}>
        <View style={styles.profile_absence_date}>
          <Text style={applicationStyles.small_header}>
            {absence_type_options.find(abs => abs.value === absence.type)
              ?.label || 'Unbekannt'}{' '}
          </Text>
          <View style={styles.profile_absence_state_display}>
            <IconDisplay
              icon="calendar"
              text={`${getDateObject(absence.start_date).date} - ${
                getDateObject(absence.end_date).date
              }`}
              color={themeColors.text}
              fontColor={themeColors.text}
            />
            <IconDisplay
              icon="state"
              color={transformToColor(
                absence_state_options.find(
                  absenceState => absenceState.value === absence.state
                )?.color
              )}
              fontColor={transformToColor(
                absence_state_options.find(
                  absenceState => absenceState.value === absence.state
                )?.color
              )}
              text={
                absence_state_options.find(
                  absenceState => absenceState.value === absence.state
                )?.label
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default AbsenceDisplay;
