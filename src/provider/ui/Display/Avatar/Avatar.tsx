import { useContext } from 'react';
import { Image, Text, View } from 'react-native';
import { getImageUrl, ThemeContext, useDataStore } from '@provider';
import styles from './styles';
import { ColorKey } from '@provider/context/Theme/types';

const Avatar = ({
  userId,
  isFirst,
  borderColor
}: {
  userId: string;
  isFirst: boolean;
  borderColor: string;
}) => {
  const { users: usersDataStore } = useDataStore();
  const { themeColors } = useContext(ThemeContext);

  const currentUser = usersDataStore.find(user => user.objectId === userId);
  const portrait = currentUser?.portrait;

  if (!currentUser) {
    return null;
  }

  const getInitials = () => {
    const firstInitial = currentUser.first_name?.charAt(0)?.toUpperCase() || '';
    const lastInitial = currentUser.last_name?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  };

  if (!portrait) {
    return (
      <View style={[styles.avatar_wrapper, isFirst && styles.avatar_first]}>
        <View
          style={[
            styles.avatar_image,
            styles.avatar_initials,
            {
              backgroundColor:
                themeColors[currentUser.color as ColorKey] || '#888',
              borderColor
            }
          ]}
        >
          <Text style={styles.avatar_initials_text}>{getInitials()}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.avatar_wrapper, isFirst && styles.avatar_first]}>
      <Image
        style={[styles.avatar_image, { borderColor }]}
        source={{
          uri: getImageUrl({
            fileName: portrait.name,
            width: 64,
            height: 64
          })
        }}
      />
    </View>
  );
};

export default Avatar;
