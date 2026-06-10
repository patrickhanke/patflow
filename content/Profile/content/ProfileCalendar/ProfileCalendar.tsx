import { formatISO9075, getDaysInMonth, getDay } from 'date-fns';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import CalendarHeader from './content/CalendarHeader';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle
} from 'react-native-reanimated';
import styles from './styles';
import { Day, User } from '@types';
import { ThemeContext, useParse, getImageUrl } from '@provider';
import weekdays from '@provider/constants/weekdays';

type DayData = {
  [userId: string]: {
    [date: string]: Day[];
  };
};

const ProfileCalendar = () => {
  const [intervalIndex, setIntervalIndex] = useState(new Date().getMonth());
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const { Parse, isReady } = useParse();
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState<Day[]>([]);
  const [staff, setStaff] = useState<User[]>([]);

  const scrollX = useSharedValue(0);

  const year = new Date().getFullYear();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    }
  });

  const loadData = useCallback(async () => {
    if (!isReady) return;

    setLoading(true);
    try {
      // Load Days for the selected month
      const DayClass = Parse.Object.extend('Day');
      const dayQuery = new Parse.Query(DayClass);
      dayQuery.limit(1000);
      dayQuery.equalTo('year', year);
      dayQuery.equalTo('month', intervalIndex);
      dayQuery.select(['date', 'type', 'user']);
      dayQuery.include('user');

      const dayResults = await dayQuery.find();
      setDays(dayResults.map(r => r.toJSON() as unknown as Day));
      // Load staff
      const UserClass = Parse.Object.extend('_User');
      const staffQuery = new Parse.Query(UserClass);
      staffQuery.select(
        'objectId',
        'first_name',
        'last_name',
        'portrait',
        'color'
      );

      const staffResults = await staffQuery.find();
      setStaff(staffResults.map(r => r.toJSON() as unknown as User));
    } catch (error) {
      console.error('Error loading data:', error);
      setDays([]);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, [isReady, Parse, year, intervalIndex]);

  useEffect(() => {
    if (isReady) {
      loadData();
    }
  }, [isReady, loadData]);

  const daysInMonth = useMemo(() => {
    return getDaysInMonth(new Date(year, intervalIndex));
  }, [year, intervalIndex]);

  const dates = useMemo(() => {
    const dateArray: Array<{
      dateString: string;
      dayNumber: number;
      weekdayShort: string;
      isWeekend: boolean;
    }> = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, intervalIndex, i);
      const dayOfWeek = getDay(date);
      const weekday = weekdays.find(wd => wd.iso_id === dayOfWeek);
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      dateArray.push({
        dateString: formatISO9075(date, { representation: 'date' }),
        dayNumber: i,
        weekdayShort: weekday?.short || '',
        isWeekend
      });
    }
    return dateArray;
  }, [year, intervalIndex, daysInMonth]);

  const dayData = useMemo(() => {
    const data: DayData = {};

    days.forEach((day: Day) => {
      const userId = day.user.objectId;
      const date = day.date;

      if (!data[userId]) {
        data[userId] = {};
      }

      if (!data[userId][date]) {
        data[userId][date] = [];
      }

      data[userId][date].push(day);
    });

    return data;
  }, [days]);

  const renderUserAvatar = (user: User) => {
    const getInitials = () => {
      const firstInitial = user.first_name?.charAt(0)?.toUpperCase() || '';
      const lastInitial = user.last_name?.charAt(0)?.toUpperCase() || '';
      return `${firstInitial}${lastInitial}`;
    };

    const userColor =
      user.color && user.color in themeColors
        ? themeColors[user.color as keyof typeof themeColors]
        : '#888';

    if (!user.portrait) {
      return (
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: userColor,
              borderColor: themeColors.border
            }
          ]}
        >
          <Text style={styles.avatar_text}>{getInitials()}</Text>
        </View>
      );
    }

    return (
      <Image
        style={[styles.avatar, { borderColor: themeColors.border }]}
        source={{
          uri: getImageUrl({
            fileName: user.portrait.name,
            width: 40,
            height: 40
          })
        }}
      />
    );
  };

  const renderDaySquare = (
    userId: string,
    dateString: string,
    isWeekend: boolean
  ) => {
    const userDays = dayData[userId]?.[dateString] || [];

    if (userDays.length === 0) {
      return (
        <View
          key={dateString}
          style={[
            styles.day_square,
            {
              backgroundColor: isWeekend
                ? themeColors.disabled
                : 'rgba(128, 128, 128, 0.1)'
            }
          ]}
        />
      );
    }

    const hasWork = userDays.some(d => d.type === 'work');
    const hasAbsence = userDays.some(d => d.type === 'absence');

    if (hasWork && hasAbsence) {
      return (
        <View
          key={dateString}
          style={[styles.day_square, { backgroundColor: 'transparent' }]}
        >
          <View
            style={[styles.day_square_half, { backgroundColor: '#4CAF50' }]}
          />
          <View
            style={[styles.day_square_half, { backgroundColor: '#FFC107' }]}
          />
        </View>
      );
    }

    if (hasWork) {
      return (
        <View
          key={dateString}
          style={[styles.day_square, { backgroundColor: '#4CAF50' }]}
        />
      );
    }

    if (hasAbsence) {
      return (
        <View
          key={dateString}
          style={[styles.day_square, { backgroundColor: '#FFC107' }]}
        />
      );
    }

    return (
      <View
        key={dateString}
        style={[
          styles.day_square,
          {
            backgroundColor: isWeekend
              ? themeColors.disabled
              : 'rgba(128, 128, 128, 0.1)'
          }
        ]}
      />
    );
  };

  const AnimatedAvatar = ({ user }: { user: User }) => {
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: scrollX.value }]
      };
    });

    return (
      <Animated.View
        style={[
          styles.avatar_sticky_container,
          animatedStyle,
          { backgroundColor: themeColors.light_background }
        ]}
      >
        {renderUserAvatar(user)}
      </Animated.View>
    );
  };

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: -scrollX.value }]
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={applicationStyles.section_container}>
        <CalendarHeader
          intervalIndex={intervalIndex}
          setIntervalIndex={setIntervalIndex}
        />
        {loading ? (
          <View style={applicationStyles.loading_container}>
            <ActivityIndicator />
          </View>
        ) : (
          <View style={styles.calendar_container}>
            <View style={styles.header_container}>
              {/* <View style={styles.avatar_header_space} /> */}
              <View style={styles.header_scroll_wrapper}>
                <Animated.View style={[styles.days_row, headerAnimatedStyle]}>
                  {dates.map(date => (
                    <View key={date.dateString} style={styles.day_header}>
                      <Text
                        style={[
                          styles.day_header_text,
                          { color: themeColors.text }
                        ]}
                      >
                        {date.dayNumber}
                      </Text>
                      <Text
                        style={[
                          styles.day_header_weekday,
                          { color: themeColors.text }
                        ]}
                      >
                        {date.weekdayShort}
                      </Text>
                    </View>
                  ))}
                </Animated.View>
              </View>
            </View>
            <Animated.ScrollView showsVerticalScrollIndicator={true}>
              <Animated.ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
              >
                <View>
                  {staff.map(user => (
                    <View key={user.objectId} style={styles.user_row_wrapper}>
                      <AnimatedAvatar user={user} />
                      <View style={styles.days_row}>
                        {dates.map(date =>
                          renderDaySquare(
                            user.objectId,
                            date.dateString,
                            date.isWeekend
                          )
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </Animated.ScrollView>
            </Animated.ScrollView>
          </View>
        )}
      </View>
      <View style={applicationStyles.section_bottom_container} />
    </View>
  );
};

export default ProfileCalendar;
