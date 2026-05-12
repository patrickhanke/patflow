export type UnderlineSwitchButtonElement = {
  value: string | number;
  label: string;
  disabled?: boolean;
  is_icon?: boolean;
};

export type UnderlineSwitchButtons = {
  buttonStates: Array<UnderlineSwitchButtonElement & any>;
  currentState: UnderlineSwitchButtonElement;
  changeHandler: (T: UnderlineSwitchButtonElement) => void;
  underlineButtons?: boolean;
};
