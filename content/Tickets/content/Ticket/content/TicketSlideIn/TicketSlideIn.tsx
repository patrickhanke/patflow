import React, { useCallback, useContext, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
  AppContext,
  CreateImages,
  Divider,
  IconButton,
  IconDisplay,
  ImageDisplay,
  Modal,
  ThemeContext,
  ticket_state_options,
  transformToColor,
  useSaveImages
} from '@provider';
import styles from './styles';
import { Asset } from 'react-native-image-picker';
import uuid from 'react-native-uuid';
import { Ticket } from '@types';

const TicketSlideIn = ({
  ticket,
  refetch,
  noEdits = false
}: {
  ticket: Ticket;
  refetch: () => Promise<Ticket[]>;
  noEdits?: boolean;
}) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);

  const [imageLoading, setImageLoading] = useState(false);
  const { indicatorHandler, isConnected } = useContext(AppContext);
  const [siteState, setSiteState] = useState('start');
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const { saveImages } = useSaveImages({ isConnected });

  const addImagesHandler = useCallback(
    async (images: Asset[]) => {
      setDataHasChanged(false);
      setImageLoading(true);
      const indicatorElement = {
        loading: 'Bilder werden hochgeladen',
        error: 'Fehler beim Hochladen',
        success: 'Bilder erfolgreich hochgeladen',
        id: uuid.v4() as string
      };
      indicatorHandler(indicatorElement, 'loading');

      const result = await saveImages({
        assets: images,
        title: ticket.title,
        ticketId: ticket.objectId
      });

      if (result?.success) {
        if (!isConnected) {
          indicatorHandler(
            {
              ...indicatorElement,
              success:
                'Bilder gespeichert, werden bei Verbindung synchronisiert'
            },
            'success'
          );
        } else {
          indicatorHandler(indicatorElement, 'success');
          await refetch();
        }
      } else {
        indicatorHandler(
          {
            ...indicatorElement,
            error: result?.error || indicatorElement.error
          },
          'error'
        );
      }

      await refetch();
      setImageLoading(false);
      setSiteState('start');
    },
    [
      saveImages,
      ticket.objectId,
      ticket.title,
      isConnected,
      indicatorHandler,
      refetch
    ]
  );

  console.log({ ticket });

  return (
    <View style={styles.slidein_container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12, gap: 12 }}
      >
        {/* Property Section */}
        <View style={applicationStyles.horizontal_container}>
          <IconDisplay icon="building" color={themeColors.primary} size={21} />
          <View style={{ flex: 1 }}>
            <Text style={applicationStyles.text}>{ticket?.property?.name}</Text>
          </View>
        </View>
        <Divider showLine />

        {/* State Section */}
        <View style={applicationStyles.horizontal_container}>
          <IconDisplay icon="state" color={themeColors.primary} size={21} />
          <View style={{ flex: 1 }}>
            <IconDisplay
              icon="state"
              color={transformToColor(
                ticket_state_options.find(
                  ticketState => ticketState.value === ticket.state
                )?.color
              )}
              fontColor={transformToColor(
                ticket_state_options.find(
                  ticketState => ticketState.value === ticket.state
                )?.color
              )}
              text={
                ticket_state_options.find(
                  ticketState => ticketState.value === ticket.state
                )?.label
              }
            />
          </View>
        </View>
        <Divider showLine />

        {/* Description Section */}
        {ticket.description && (
          <>
            <View style={applicationStyles.horizontal_container}>
              <IconDisplay
                icon="document"
                color={themeColors.primary}
                size={21}
              />
              <View style={{ flex: 1 }}>
                <Text style={applicationStyles.text} selectable>
                  {ticket.description || '-'}
                </Text>
              </View>
            </View>
            <Divider showLine />
          </>
        )}

        {/* Images Section */}
        <View style={{ flex: 1, gap: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              alignItems: 'flex-start',
              flex: 1
            }}
          >
            <IconDisplay icon="image" color={themeColors.primary} size={21} />
            <View style={{ flex: 1, gap: 12 }}>
              <Text style={applicationStyles.text}>Bilder</Text>
            </View>
          </View>
          {ticket.images && ticket.images.length > 0 && (
            <ScrollView style={{ flex: 1, minHeight: 120 }}>
              <ImageDisplay imageIds={ticket.images} />
            </ScrollView>
          )}
          {!noEdits && (
            <IconButton
              icon="add"
              size="small"
              onPress={() => setSiteState('image')}
              color={themeColors.text}
              text="Bilder hinzufügen"
            />
          )}
        </View>
      </ScrollView>

      <Modal
        dataHasChanged={dataHasChanged}
        isVisible={siteState === 'image'}
        title="Bilder hinzufügen"
        setIsVisible={() => {
          setSiteState('start');
          if (dataHasChanged) {
            setDataHasChanged(false);
          }
        }}
      >
        <CreateImages
          onSave={images => addImagesHandler(images)}
          onCancel={() => setSiteState('start')}
          loading={imageLoading}
          onSetAsstes={() => {
            setDataHasChanged(true);
          }}
        />
      </Modal>
    </View>
  );
};

export default TicketSlideIn;
