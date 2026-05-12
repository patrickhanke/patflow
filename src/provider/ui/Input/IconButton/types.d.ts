export type IconButtonProps = {
  icon: 'info' | 'state' | 'add' | 'edit' | 'delete';
  onPress?: () => void;
  text?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
};
