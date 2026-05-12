import {
  AppContext,
  NoConnenction,
  ThemeContext,
  UnderlineSwitchButtons
} from '@provider';
import React, { FC, useContext } from 'react';
import viewStates from './constants/viewStates';
import ProfileSettings from './content/ProfileSettings';
import ProfileAbsence from './content/ProfileAbsence';
import ProfileCalendar from './content/ProfileCalendar';
import ProfileTimes from './content/ProfileTimes';
import { ProfileProps } from './types';
import { View } from 'react-native';

const Profile: FC<ProfileProps> = () => {
  const { applicationStyles } = useContext(ThemeContext);
  const { user, isConnected } = useContext(AppContext);
  const [viewState, setViewState] = React.useState(viewStates[0]);

  if (!isConnected) {
    return <NoConnenction />;
  }

  return (
    <View style={applicationStyles.content_container}>
      <View style={applicationStyles.section_top_container}>
        <UnderlineSwitchButtons
          buttonStates={viewStates}
          currentState={viewState}
          changeHandler={value =>
            setViewState(value as (typeof viewStates)[number])
          }
        />
      </View>
      {viewState.value === 'settings' && <ProfileSettings user={user} />}
      {viewState.value === 'absence' && <ProfileAbsence user={user} />}
      {viewState.value === 'calendar' && <ProfileCalendar />}
      {viewState.value === 'times' && <ProfileTimes user={user} />}
    </View>
  );
};

export default Profile;
