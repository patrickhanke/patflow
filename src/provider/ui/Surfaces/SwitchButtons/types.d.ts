export type SwitchButtonElement = {
  value: string | number;
  label: string;
  disabled?: boolean;
  is_icon?: boolean;
};

export type SwitchButtons = {
  buttonStates: Array<SwitchButtonElement & any>;
  currentState: SwitchButtonElement;
  changeHandler: (T: SwitchButtonElement) => void;
  underlineButtons?: boolean;
};
