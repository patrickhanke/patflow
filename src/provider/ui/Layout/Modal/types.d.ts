export type BottomSheetProps = {
  children: React.ReactNode;
  title: string;
  setModalVisible: (visible: boolean) => void;
  visible: boolean;
};

export type DataHasChangedMessageProps = {
  dataHasChanged: boolean;
  closeModal: boolean;
  setCloseModal: Dispatch<SetStateAction<boolean>>;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
};

export type ModalProps = {
  isVisible: boolean;
  children: React.ReactNode;
  dataHasChanged: boolean;
  backHandler: BackHandler;
  title?: string;
};
