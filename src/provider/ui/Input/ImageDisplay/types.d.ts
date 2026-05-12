import { Asset } from 'react-native-image-picker';

export type ImageDisplayProps = {
  imageIds?: string[];
  setImage?: React.Dispatch<React.SetStateAction<any>>;
};

export type AssetDisplayProps = {
  assets: Asset[];
  setAssets?: React.Dispatch<React.SetStateAction<Asset[]>>;
  removable?: boolean;
};

export type SingleImageDisplayProps = {
  image: string;
  setImage?: React.Dispatch<React.SetStateAction<any>>;
  width?: number;
  height?: number;
  title?: string;
  updateImage?: (image: Asset) => void;
  borderRadius?: number | null;
};

export type TextInputProps = {
  defaultValue: string;
  onChange: (inputValue: string, image?: string) => void;
  multiline?: boolean;
  placeholder?: string;
  buttonText: string;
};
