import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View
} from 'react-native';
import {
  AppContext,
  AssetDisplay,
  Button,
  CreateImages,
  Divider,
  IconButton,
  IconDisplay,
  Modal,
  parseErrorMessage,
  saveObjectToLocalStorage,
  TextInput,
  ThemeContext,
  useAxiosClient,
  useParse,
  useSaveImages
} from '@provider';
import ObjectSelectWithState from './ObjectSelectWithState';
import { Asset } from 'react-native-image-picker';
import uuid from 'react-native-uuid';
import { ObjectSelect, Ticket as TicketType } from '@types';
import { v4 as uuidv4 } from 'uuid';

const CreateTicket = ({
  refetch,
  modalDataHasChanged,
  setModalDataHasChanged,
  closeModal
}: {
  refetch: () => Promise<TicketType[]>;
  modalDataHasChanged: boolean;
  setModalDataHasChanged: Dispatch<SetStateAction<boolean>>;
  closeModal?: () => void;
}) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const { user, indicatorHandler, projectId, isConnected } =
    useContext(AppContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [object, setObject] = useState<ObjectSelect>(
    undefined as unknown as ObjectSelect
  );

  const axiosclient = useAxiosClient();
  const { saveImages } = useSaveImages({ isConnected });
  const [selectImages, setSelectImages] = useState(false);
  const { Parse } = useParse();

  const createTicketHandler = useCallback(async () => {
    setLoading(true);
    const indicatorElement = {
      loading: 'Warte auf Verbindung ...',
      error: 'Fehler beim Erstellen',
      success: 'Ticket erfolgreich erstellt',
      id: uuid.v4() as string
    };
    indicatorHandler(indicatorElement, 'loading');

    try {
      if (isConnected) {
        const TicketClass = Parse.Object.extend('Ticket');
        const Ticket = new TicketClass();

        const propertyClass = new Parse.Object('Property');
        propertyClass.set('objectId', object?.value);

        const projectClass = new Parse.Object('Project');
        projectClass.set('objectId', projectId);

        const userClass = new Parse.Object('_User');
        userClass.set('objectId', user.objectId);

        Ticket.set('state', 'open');
        Ticket.set('title', title);
        Ticket.set('description', description);
        Ticket.set('comments', []);
        Ticket.set('images', []);
        Ticket.set('task', null);
        Ticket.set('created_by', userClass);
        Ticket.set('description', description);
        Ticket.set('title', title);
        Ticket.set('property', propertyClass);
        Ticket.set('project', projectClass);
        await Ticket.saveEventually();
        await Ticket.pin().then(() => {
          console.log('Ticket object pinned:', Ticket.id);
        });

        console.log('Ticket object saved:', Ticket.id);

        // If we have images and a ticket ID, save them
        if (assets?.length > 0) {
          await saveImages({
            assets,
            title,
            ticketId: Ticket.id,
            propertyId: object?.value
          });
        }
      } else if (!isConnected) {
        const ticketId = uuidv4();
        const localTicket = {
          title,
          description,
          type: 'ticket',
          created_by: user.objectId,
          property: object?.value,
          project: projectId,
          state: 'open',
          images: assets?.map(asset => asset.uri),
          task: null
        };

        if (assets?.length > 0) {
          for (const asset of assets) {
            saveImages({
              assets: [asset],
              title,
              ticketId: ticketId,
              propertyId: object?.value
            });
          }
        }

        await saveObjectToLocalStorage({
          object: localTicket,
          key: ticketId
        });
      }
    } catch (error) {
      indicatorHandler(
        {
          ...indicatorElement,
          error: parseErrorMessage(error) || indicatorElement.error
        },
        'error'
      );
    }
    if (isConnected) {
      indicatorHandler(
        {
          ...indicatorElement,
          success: 'Ticket erfolgreich erstellt'
        },
        'success'
      );
    } else {
      indicatorHandler(
        {
          ...indicatorElement,
          success:
            'Ticket erfolgreich erstellt, wird bei Verbindung hochgeladen'
        },
        'success'
      );
    }

    await refetch();
    setLoading(false);
    if (closeModal) {
      closeModal();
    }
  }, [
    title,
    description,
    assets,
    projectId,
    object,
    saveImages,
    isConnected,
    indicatorHandler,
    user,
    axiosclient,
    refetch,
    closeModal
  ]);

  const buttonDisabledHandler = useCallback(() => {
    if (!title || !object) {
      return true;
    }
    if (loading) {
      return true;
    }
    return false;
  }, [title, object, loading]);

  useEffect(() => {
    if (
      !modalDataHasChanged &&
      (title || description || object || assets?.length > 0)
    ) {
      setModalDataHasChanged(true);
    }
  }, [modalDataHasChanged, title, description, object, assets]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={40}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          // flex: 1,
          gap: 12,
          backgroundColor: themeColors.background
        }}
        showsVerticalScrollIndicator={true}
        bounces={false}
      >
        <View>
          <Text style={applicationStyles.label}>Objekt auswählen</Text>
          <ObjectSelectWithState
            selectedObject={object}
            setSelectedObject={setObject}
          />
        </View>
        <Divider />
        <View>
          <Text style={applicationStyles.label}>Titel</Text>
          <TextInput
            defaultValue={title}
            placeholder="Titel oder Betreff"
            onChange={setTitle}
          />
        </View>
        <Divider />
        <View>
          <Text style={applicationStyles.label}>Beschreibung</Text>
          <TextInput
            defaultValue={description}
            placeholder="Ticket Beschreibung"
            onChange={setDescription}
            multiline={true}
          />
        </View>
        <Divider />
        <View style={{ flex: 1 }}>
          <View style={applicationStyles.horizontal_container}>
            <IconDisplay text="Bilder" icon="image" size={18} color={'text'} />
            <IconButton
              icon="add"
              size="small"
              text="Bilder hinzufügen"
              onPress={() => setSelectImages(true)}
              color={themeColors.text}
              backgroundColor={'transparent'}
            />
          </View>
          <ScrollView>
            <AssetDisplay assets={assets} setAssets={setAssets} />
          </ScrollView>
        </View>
        <Modal
          dataHasChanged={dataHasChanged}
          isVisible={selectImages}
          setIsVisible={() => {
            setSelectImages(false);
            if (dataHasChanged) {
              setDataHasChanged(false);
            }
          }}
        >
          <CreateImages
            onSave={newAssets => {
              setImageLoading(true);
              const assetsCopy = [...assets];
              setAssets([...assetsCopy, ...newAssets]);
              setImageLoading(false);
              setSelectImages(false);
            }}
            onCancel={() => setSelectImages(false)}
            loading={imageLoading}
            onSetAsstes={() => {
              setDataHasChanged(true);
            }}
          />
        </Modal>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: themeColors.background
        }}
      >
        <Button
          size="medium"
          disabled={buttonDisabledHandler()}
          onPress={() => createTicketHandler()}
          color={themeColors.blue}
          text="Ticket erstellen"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateTicket;
