import { Modal, ThemeContext, useParse } from '@provider';
import { Absence, Day, Record, UserDisplayData } from '@types';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View
} from 'react-native';
import AbsenceDisplay from './components/AbsenceDisplay';
import CreateVacation from './content/CreateVacation';
import { Dropdown } from 'react-native-element-dropdown';
import styles from './styles';
import { YearOptions } from './types';
import useFindRecords from './hooks/useFindRecords';
import useGetAbsence from './hooks/useGetAbsence';
import getRemainingVacation from './functions/getRemainingVacation';

const ProfileAbsence = ({ user }: { user: UserDisplayData }) => {
  const { Parse, isReady } = useParse();
  const month = new Date().getMonth();
  const { applicationStyles, themeColors } = useContext(ThemeContext);
  const [record, setRecord] = useState<Record | null>(null);
  const [createAbsence, setCreateAbsence] = useState(false);
  const [dataHasChanged, setDataHasChanged] = useState(false);

  const [days, setDays] = useState<Day[]>([]);

  const { records, loading } = useFindRecords({
    userId: user.objectId,
    year: new Date().getFullYear()
  });

  const loadDays = useCallback(async () => {
    if (!isReady || !record) return;

    try {
      const DayClass = Parse.Object.extend('Day');
      const query = new Parse.Query(DayClass);

      const UserClass = Parse.Object.extend('_User');
      const userPointer = UserClass.createWithoutData(user.objectId);

      query.equalTo('user', userPointer);
      query.equalTo('year', record.year);

      const results = await query.find();
      setDays(results.map(r => r.toJSON() as unknown as Day));
    } catch (error) {
      console.error('Error loading days:', error);
      setDays([]);
    }
  }, [isReady, Parse, record, user.objectId]);

  useEffect(() => {
    if (isReady && record) {
      loadDays();
    }
  }, [isReady, loadDays, record]);

  const yearOptions: YearOptions = useMemo(() => {
    const years: YearOptions = [];
    if (records.length > 0) {
      records.forEach(rc => {
        years.push({ label: rc.year.toString(), value: rc.year });
      });
    }
    return years.sort((a, b) => a.value - b.value);
  }, [records]);

  const [year, setYear] = useState<YearOptions[number] | null>(
    yearOptions.find(y => y.value === new Date().getFullYear()) || null
  );

  const {
    absences,
    loading: absenceLoading,
    refetch: absenceRefetch
  } = useGetAbsence({
    userId: user.objectId,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    if (!year && yearOptions.length > 0) {
      setYear(
        yearOptions.find(y => y.value === new Date().getFullYear()) || null
      );
    }
    if (records.length > 0 && year) {
      setRecord(records.find(rec => rec.year === year.value) || null);
    }
  }, [records, year]);

  const vacationData = useMemo(() => {
    if (!year || !record) {
      return null;
    }
    const start = new Date(year?.value, 0, 1).toISOString();
    const end = new Date(year?.value, month + 1, 0).toISOString();

    const data = getRemainingVacation(start, end, record, days);
    return data;
  }, [record, days]);

  console.log(vacationData);

  if (loading || absenceLoading) {
    return (
      <View style={applicationStyles.loading_container}>
        <ActivityIndicator />
      </View>
    );
  }

  const isDisabled = !record || !year || year.value < new Date().getFullYear();

  console.log({ createAbsence });
  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={[styles.select_container]}>
          <Dropdown
            style={[
              applicationStyles.dropdown,
              { backgroundColor: themeColors.light }
            ]}
            placeholder="Jahr wählen"
            mode="default" // flat or
            activeColor={themeColors.primary}
            selectedTextStyle={{ color: themeColors.text }}
            placeholderStyle={{ color: themeColors.text }}
            itemTextStyle={{ color: themeColors.text }}
            containerStyle={{
              borderColor: themeColors.border,
              backgroundColor: themeColors.background,
              borderRadius: 6
            }}
            data={yearOptions}
            value={year}
            onChange={value => setYear(value)}
            labelField="label"
            valueField="value"
          />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentInsetAdjustmentBehavior="automatic"
        >
          {absences.map((abs: Absence) => (
            <AbsenceDisplay absence={abs} key={abs.objectId} />
          ))}
        </ScrollView>

        <View
          style={[
            applicationStyles.section_bottom_container,
            { flex: 0, flexShrink: 0 }
          ]}
        >
          <View style={[applicationStyles.vertical_container, { flex: 0 }]}>
            <View style={[applicationStyles.horizontal_container]}>
              <Text style={applicationStyles.small_header}>
                Genommener Urlaub:
              </Text>
              <Text style={applicationStyles.small_header}>
                {vacationData?.takenVacation.toString() || '0'} Tage
              </Text>
            </View>
            <View style={[applicationStyles.horizontal_container]}>
              <Text style={applicationStyles.small_header}>
                Resturlaub {new Date().getFullYear().toString()}:
              </Text>
              <Text style={applicationStyles.small_header}>
                {vacationData?.remainingVacation.toString() || '0'} Tage
              </Text>
            </View>
          </View>
          <View style={applicationStyles.divider} />
          {record ? (
            <Pressable
              hitSlop={6}
              onPress={() => setCreateAbsence(true)}
              style={
                isDisabled
                  ? applicationStyles.add_button_disabled
                  : applicationStyles.add_button
              }
            >
              <Text style={applicationStyles.add_button_text}>
                + Neue Urlaubsanfrage
              </Text>
            </Pressable>
          ) : (
            <Text>Keine Zeiterfassung hinterlegt</Text>
          )}
        </View>
      </View>
      {record && (
        <Modal
          isVisible={createAbsence}
          setIsVisible={setCreateAbsence}
          dataHasChanged={dataHasChanged}
          title="Urlaubsanfrage erstellen"
        >
          <CreateVacation
            record={record}
            refetch={absenceRefetch}
            dataHasChanged={dataHasChanged}
            setDataHasChanged={setDataHasChanged}
            setCreateTime={setCreateAbsence}
          />
        </Modal>
      )}
    </>
  );
};

export default ProfileAbsence;
