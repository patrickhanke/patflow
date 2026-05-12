import React, { useState, useContext } from 'react';
import { Pressable, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Asset,
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import styles from './styles';
import { Button } from '../Button';
import AssetDisplay from './components/AssetDisplay';
import { Divider, ThemeContext } from '@provider';

const CreateImages = ({
  onCancel,
  onSave,
  initialImages = [],
  externalState = false,
  title,
  loading = false,
  selectionLimit = 0,
  onSetAsstes
}: {
  onSave: (i: Asset[]) => void;
  onCancel?: () => void;
  initialImages?: Asset[];
  externalState?: boolean;
  title?: string;
  loading?: boolean;
  selectionLimit?: number;
  onSetAsstes?: (assets: Asset[]) => void;
}) => {
  const [assets, setAssets] = useState(initialImages);
  const { themeColors, applicationStyles } = useContext(ThemeContext);

  return (
    <View style={styles.create_image_container}>
      {title && <Text style={applicationStyles.medium_header}>{title}</Text>}
      {assets && assets.length > 0 ? (
        <AssetDisplay
          assets={assets}
          setAssets={setAssets}
          removable={!loading}
        />
      ) : initialImages && initialImages.length > 0 ? (
        <AssetDisplay
          assets={initialImages}
          setAssets={!externalState ? setAssets : undefined}
          removable={!loading}
        />
      ) : null}
      <View style={styles.icons_container}>
        <View style={styles.icon_container}>
          <Pressable
            hitSlop={6}
            disabled={loading}
            style={[
              styles.pressable_icon,
              { backgroundColor: themeColors.primary }
            ]}
            onPress={() =>
              launchImageLibrary(
                {
                  mediaType: 'photo',
                  includeBase64: true,
                  quality: 0.4,
                  selectionLimit: selectionLimit
                },
                response => {
                  if (response?.assets && response?.assets?.length > 0) {
                    if (externalState) {
                      onSave(response?.assets);
                    } else {
                      const imagesCopy = [...assets];
                      imagesCopy.push(...response?.assets);
                      setAssets(imagesCopy);
                      if (onSetAsstes) {
                        onSetAsstes(imagesCopy);
                      }
                    }
                  }
                }
              )
            }
          >
            <MaterialIcons
              style={styles.icon}
              name="paperclip"
              size={24}
              color={themeColors.button}
            />
          </Pressable>
          <Text style={{ fontWeight: 600, color: themeColors.text }}>
            Galerie
          </Text>
        </View>
        <View style={styles.icon_container}>
          <Pressable
            hitSlop={6}
            disabled={loading}
            style={[
              styles.pressable_icon,
              { backgroundColor: themeColors.primary }
            ]}
            onPress={() =>
              launchCamera(
                {
                  mediaType: 'photo',
                  includeBase64: true,
                  quality: 0.4
                },
                response => {
                  if (response?.assets && response?.assets?.length > 0) {
                    console.log('response', response);
                    if (externalState) {
                      onSave(response?.assets);
                    } else {
                      const imagesCopy = [...assets];
                      imagesCopy.push(...response?.assets);
                      setAssets(imagesCopy);
                      if (onSetAsstes) {
                        onSetAsstes(imagesCopy);
                      }
                    }
                  }
                }
              )
            }
          >
            <MaterialIcons
              style={styles.icon}
              name="camera-plus"
              size={24}
              color={themeColors.button}
            />
          </Pressable>
          <Text style={{ fontWeight: 600, color: themeColors.text }}>
            Kamera
          </Text>
        </View>
      </View>
      <Divider />
      {!externalState && (
        <View style={applicationStyles.button_container}>
          <Button
            size="medium"
            onPress={() => onSave(assets)}
            text={assets.length > 1 ? 'Bilder speichern' : 'Bild speichern'}
            color={themeColors.primary}
            fontColor={themeColors.white}
            disabled={loading || !assets || assets.length === 0}
          />
          <Button
            size="medium"
            onPress={() => {
              if (onCancel) {
                onCancel();
              }
            }}
            text="Abbrechen"
            color={themeColors.border}
            fontColor={themeColors.dark}
            disabled={loading}
          />
        </View>
      )}
    </View>
  );
};

export default CreateImages;
