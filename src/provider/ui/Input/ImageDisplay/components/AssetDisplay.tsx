import React, { useContext, useState } from 'react';
import ImageView from 'react-native-image-viewing';

import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { AssetDisplayProps } from '../types';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles';
import { isArray } from 'lodash';
import { Asset } from 'react-native-image-picker';
import { ThemeContext } from '@provider';

const AssetDisplay = ({
  assets = [],
  setAssets,
  removable = true
}: AssetDisplayProps) => {
  const [visible, setIsVisible] = useState(false);
  const { themeColors: colors } = useContext(ThemeContext);

  return (
    <>
      <ScrollView
        style={styles.image_container}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          overflow: 'visible'
        }}
        horizontal
      >
        <View style={styles.multi_asset_container}>
          {assets.map((asset: Asset) => {
            return (
              <View
                key={asset.uri as string}
                style={styles.image_display_content}
              >
                <Pressable
                  hitSlop={6}
                  disabled={!isArray(assets)}
                  onPress={() => setIsVisible(true)}
                >
                  <Image
                    source={asset}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </Pressable>
                {setAssets && removable && (
                  <View
                    style={[
                      styles.image_delete_button,
                      { backgroundColor: colors.blue }
                    ]}
                  >
                    <Pressable
                      hitSlop={6}
                      // disabled
                      onPress={() => {
                        const assetsCopy = [...assets];
                        assetsCopy.splice(assetsCopy.indexOf(asset), 1);
                        setAssets(assetsCopy);
                      }}
                    >
                      <Text style={{ color: colors.white }}>
                        <MaterialIcons
                          name="close"
                          size={15}
                          color={colors.white}
                        />
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <ImageView
        images={assets.map((asset: Asset) => ({ uri: asset.uri })) as any}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </>
  );
};

export default AssetDisplay;
