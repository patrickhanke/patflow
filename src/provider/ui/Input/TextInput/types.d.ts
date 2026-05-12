export type ImageDisplayProps = {
  image: any;
  setImage: React.Dispatch<React.SetStateAction<any>>;
};

export type TextInputProps = {
  defaultValue: string;
  onChange: (inputValue: string, image?: string) => void;
  multiline?: boolean;
  placeholder?: string;
  secureTextEntry?: boolean;
};
