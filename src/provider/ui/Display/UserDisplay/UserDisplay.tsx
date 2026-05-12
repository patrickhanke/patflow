import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, ThemeContext, useDataStore } from '@provider';

const styles = StyleSheet.create({
  user_display_content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    height: 32,
    borderRadius: 20,
    paddingRight: 12,
    paddingVertical: 4
  },
  tinyLogo: {
    width: 32,
    height: 32,
    borderRadius: 16
  },
  text: {
    fontWeight: '500',
    fontSize: 14
  }
});

const UserDisplay = ({ userId }: { userId: string }) => {
  const { themeColors } = useContext(ThemeContext);
  const users = useDataStore(state => state.users);
  const user = users.find(us => us.objectId === userId);
  return (
    <View
      style={[
        styles.user_display_content,
        {
          backgroundColor: themeColors.light
        }
      ]}
    >
      <Avatar userId={userId} isFirst={true} borderColor={themeColors.light} />
      <Text style={[styles.text, { color: themeColors.text }]}>
        {`${user?.first_name} ${user?.last_name}` || 'Kein Nutzername'}
      </Text>
    </View>
  );
};

export default UserDisplay;
