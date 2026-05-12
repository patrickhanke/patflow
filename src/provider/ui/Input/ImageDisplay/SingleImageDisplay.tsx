import React, { useContext, useMemo, useState } from 'react';
import ImageView from 'react-native-image-viewing';

import { Image, Pressable, Text, View } from 'react-native';
import { SingleImageDisplayProps } from './types';
import Fa5Icons from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import {
  CreateImages,
  getImageUrl,
  Modal,
  ThemeContext,
  useDataStore
} from '@provider';

type ImageData = {
  objectId: string;
  title: string;
  remote_url: string;
};

const SingleImageDisplay = ({
  title,
  image,
  setImage,
  updateImage,
  width,
  borderRadius = null
}: SingleImageDisplayProps) => {
  const { themeColors } = useContext(ThemeContext);
  const [visible, setIsVisible] = useState(false);
  const [createImage, setCreateImage] = useState(false);
  const images = useDataStore(state => state.images);

  const renderImage: ImageData | null = useMemo(() => {
    const imageValue = images.find(img => img.objectId === image);
    if (imageValue) {
      return {
        objectId: imageValue.objectId,
        title: imageValue.name,
        remote_url: imageValue.file.url
      };
    }
    return null;
  }, [images, image]);

  return (
    <>
      <View style={[styles.image_display_content, { width }]}>
        {renderImage && (
          <Pressable hitSlop={6} onPress={() => setIsVisible(true)}>
            <Image
              source={{
                uri: getImageUrl({
                  fileName: renderImage.objectId,
                  width: width || 200
                })
              }}
              style={[styles.image, { borderRadius: borderRadius || 0, width }]}
              resizeMode="contain"
            />
          </Pressable>
        )}
        <Modal
          isVisible={createImage}
          setIsVisible={setCreateImage}
          dataHasChanged={false}
        >
          <CreateImages
            title={title || 'Neues Bild auswählen'}
            selectionLimit={1}
            onSave={imageValue => {
              console.log({ imageValue });
              setCreateImage(false);
              if (updateImage) {
                updateImage(imageValue[0]);
              }
            }}
            onCancel={() => setCreateImage(false)}
          />
        </Modal>
        {updateImage && (
          <View
            style={[
              styles.image_edit_icon,
              { backgroundColor: themeColors.green }
            ]}
          >
            <Pressable
              hitSlop={6}
              style={styles.image_edit_icon_pressable}
              onPress={() => {
                setCreateImage(true);
              }}
            >
              <Fa5Icons name="edit" size={15} color={themeColors.white} />
            </Pressable>
          </View>
        )}
      </View>
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

      {renderImage && (
        <ImageView
          images={[
            {
              uri: getImageUrl({
                fileName: renderImage.objectId,
                width: 960
              })
            }
          ]}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
      )}
    </>
  );
};

export default SingleImageDisplay;
