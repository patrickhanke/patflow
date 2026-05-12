import { CreateImages, getImageUrl, Modal, ThemeContext } from '@provider';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import React, { useContext, useState } from 'react';
import { Asset } from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles';

type Portrait = { name: string } | undefined;

type UserPortraitProps = {
  portrait?: Portrait;
  onImagePicked?: (asset: Asset) => Promise<void> | void;
};

const UserPortrait = ({ portrait, onImagePicked }: UserPortraitProps) => {
  const { themeColors } = useContext(ThemeContext);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSave = async (assets: Asset[]) => {
    const asset = assets?.[0];

    setPickerVisible(false);
    if (!asset || !onImagePicked) {
      return;
    }
    try {
      setUploading(true);
      await onImagePicked(asset);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Pressable
        style={styles.user_portrait_container}
        onPress={() => !uploading && setPickerVisible(true)}
        disabled={uploading}
      >
        {portrait ? (
          <Image
            src={getImageUrl({
              fileName: portrait.name,
              width: 120,
              height: 120
            })}
            style={styles.user_portrait_image}
          />
        ) : (
          <View style={styles.user_portrait_image}>
            <MaterialIcons name="photo" size={24} color="black" />
          </View>
        )}
        {onImagePicked && !uploading && (
          <View
            style={[
              overlayStyles.edit_badge,
              { backgroundColor: themeColors.blue }
            ]}
          >
            <MaterialIcons name="photo-camera" size={16} color="white" />
          </View>
        )}
        {uploading && (
          <View style={overlayStyles.loading_overlay}>
            <ActivityIndicator color="white" />
          </View>
        )}
      </Pressable>
      <Modal
        isVisible={pickerVisible}
        setIsVisible={setPickerVisible}
        dataHasChanged={false}
        title="Profilbild auswählen"
      >
        <CreateImages
          title="Profilbild auswählen"
          selectionLimit={1}
          externalState
          onSave={handleSave}
          onCancel={() => setPickerVisible(false)}
        />
      </Modal>
    </>
  );
};

const overlayStyles = StyleSheet.create({
  edit_badge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loading_overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default UserPortrait;
