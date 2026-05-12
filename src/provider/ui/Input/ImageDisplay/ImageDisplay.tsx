import React, { useMemo, useState } from 'react';
import ImageView from 'react-native-image-viewing';

import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { ImageDisplayProps } from './types';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import { isArray } from 'lodash';
import { getImageUrl, useDataStore } from '@provider';

type ImageData = {
  objectId?: string;
  title?: string;
  remote_url?: string;
  local_url?: string;
  file?: {
    name?: string;
    url?: string;
  };
};

const ImageDisplay = ({
  imageIds: imageIdsProp = [],
  setImage
}: ImageDisplayProps) => {
  const [visible, setIsVisible] = useState(false);
  const images = useDataStore(state => state.images);

  const renderImages: ImageData[] = useMemo(() => {
    if (imageIdsProp.length > 0) {
      const imagesToRender = images.filter(image =>
        imageIdsProp.includes(image.objectId)
      );
      return imagesToRender;
    }
    return [];
  }, [images, imageIdsProp]);

  return (
    <>
      <ScrollView
        style={styles.image_container}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6
        }}
        horizontal
      >
        <View style={styles.multi_images_container}>
          {renderImages &&
            renderImages.length > 0 &&
            renderImages.map((imageData: ImageData) => {
              const imageSource = {
                uri:
                  imageData?.local_url ||
                  getImageUrl({
                    fileName: imageData?.file?.name || '',
                    width: 80
                  })
              };
              return (
                <View
                  key={imageData.objectId}
                  style={styles.image_display_content}
                >
                  <Pressable
                    hitSlop={6}
                    disabled={!isArray(imageIdsProp)}
                    onPress={() => setIsVisible(true)}
                  >
                    <Image
                      source={imageSource}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  </Pressable>
                  {setImage && (
                    <Pressable
                      hitSlop={6}
                      onPress={() => {
                        setImage(null);
                      }}
                    >
                      <View>
                        <Text>
                          <MaterialIcons name="close" size={24} />
                        </Text>
                      </View>
                    </Pressable>
                  )}
                </View>
              );
            })}
        </View>
      </ScrollView>

      <ImageView
        images={
          isArray(renderImages)
            ? renderImages.map((imageData: ImageData) => {
                const uri =
                  imageData?.local_url ||
                  getImageUrl({
                    fileName: imageData.title ?? '',
                    width: 960
                  });
                return { uri: uri || '' };
              })
            : []
        }
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </>
  );
};

export default ImageDisplay;
