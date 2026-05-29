import { Button, GlobalModal, ThemeContext, useParse } from '@provider';
import { UserDisplayData } from '@types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Asset } from 'react-native-image-picker';
import styles from './styles';
import PrivacyPolicy from './components/Privacy';
import UserPortrait from './components/UserPortrait';

const ProfileSettings = ({ user }: { user: UserDisplayData }) => {
  const { applicationStyles, themeColors } = useContext(ThemeContext);
  const { Parse, isReady } = useParse();
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadUserData = useCallback(async () => {
    if (!isReady || !user?.objectId) {
      console.log('Parse not ready or no user ID, skipping query');
      return;
    }

    setLoading(true);
    try {
      const UserClass = Parse.Object.extend('_User');
      const query = new Parse.Query(UserClass);

      const result = await query.get(user.objectId);
      setData(result.toJSON());
    } catch (error) {
      console.error('Error loading user data:', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [isReady, Parse, user?.objectId]);

  useEffect(() => {
    if (isReady && user?.objectId) {
      loadUserData();
    }
  }, [isReady, loadUserData, user?.objectId]);

  const refetch = useCallback(async () => {
    await loadUserData();
  }, [loadUserData]);

  const updateImage = useCallback(
    async (image: Asset) => {
      if (!isReady || !user?.objectId) {
        console.warn(
          'Parse not ready or missing user id, cannot save portrait'
        );
        return;
      }
      if (!image?.uri && !image?.base64) {
        console.warn('Selected image has no uri/base64 data');
        return;
      }

      try {
        const fileName =
          image.fileName ||
          `portrait_${user.objectId}_${Date.now()}.${image.type?.split('/')[1] || 'jpg'}`;
        const contentType = image.type || 'image/jpeg';

        let parseFile: Parse.File;

        if (image.base64) {
          parseFile = new Parse.File(
            fileName,
            { base64: image.base64 },
            contentType
          );
        } else {
          console.error('No valid data source for file');
          return;
        }

        if (!parseFile) {
          console.error('No valid data source for file');
          return;
        }
        await parseFile.save();

        const UserClass = Parse.Object.extend('User');
        const query = new Parse.Query(UserClass);
        const userObject = await query.get(user.objectId);
        userObject?.set('portrait', parseFile);

        await userObject.save();

        await refetch();
      } catch (error) {
        console.error('Error saving portrait:', error);
      }
    },
    [Parse, isReady, refetch, user?.objectId]
  );

  if (loading) {
    return (
      <View style={applicationStyles.loading_container}>
        <ActivityIndicator />
      </View>
    );
  }

  const userDisplayData = data;
  const version = '0.9.2@beta3';

  return (
    <>
      <View style={styles.profile_settings_container}>
        <ScrollView
          contentContainerStyle={{
            ...styles.profile_settings_container,
            alignItems: 'center',
            gap: 12,
            justifyContent: 'center',
            flexGrow: 1
          }}
          contentInsetAdjustmentBehavior="automatic"
        >
          <View style={{ flex: 0 }}>
            <UserPortrait
              portrait={userDisplayData?.portrait ?? user?.portrait}
              onImagePicked={updateImage}
            />
          </View>
          <View
            style={
              (applicationStyles.vertical_container,
              { flex: 0, alignItems: 'center' })
            }
          >
            <Text style={applicationStyles.label}>Name</Text>
            <Text
              style={applicationStyles.text}
            >{`${user?.first_name} ${user?.last_name}`}</Text>
          </View>
          <View
            style={
              (applicationStyles.vertical_container,
              { flex: 0, alignItems: 'center' })
            }
          >
            <Text style={applicationStyles.label}>E-Mail</Text>
            <Text style={applicationStyles.text}>{user?.email}</Text>
          </View>
          <View
            style={
              (applicationStyles.vertical_container,
              { flex: 0, alignItems: 'center' })
            }
          >
            <Button
              onPress={() => setShowPrivacy(true)}
              text="Datenschutzbestimmungen"
              size="small"
              color={themeColors.primary}
              fontColor={themeColors.button}
            />
          </View>
        </ScrollView>
        <View style={applicationStyles.section_bottom_container}>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[applicationStyles.text, { textAlign: 'right' }]}>
              v {version}
            </Text>
          </View>
        </View>
      </View>
      <GlobalModal
        dataHasChanged={false}
        isVisible={showPrivacy}
        backHandler={() => setShowPrivacy(false)}
        title="Datenschutzerklärung"
      >
        <PrivacyPolicy />
      </GlobalModal>
    </>
  );
};

export default ProfileSettings;
