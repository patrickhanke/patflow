export type SelectElement = {
  value: string;
  label: string;
  element?: ReactNode;
  selected?: boolean;
  single?: boolean;
  disabled?: boolean;
  [key: string]: object | Array<> | string | number | boolean;
};

export type ElementSelectInterfaceProps = {
  title?: string;
  elements: SelectElement[];
  selectedElements: SelectElement[];
  onSelect: (elements: SelectElement[]) => void;
  max?: number;
  isSearchable?: boolean;
  selectProperty?: boolean;
  useTiles?: boolean;
  selectAll?: boolean;
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  loading?: boolean;
  onSave: (elements: SelectElement[]) => void;
  disabled?: boolean;
  layer?: 1 | 2 | 3 | 4;
};

export type ListElementProps = {
  element: SelectElement;
  isSelected: boolean;
  onSelect: (element: SelectElement) => void;
  useTiles?: boolean;
};
