export type IconDisplayProps = {
  icon?:
    | 'property'
    | 'description'
    | 'comment'
    | 'image'
    | 'calendar'
    | 'user'
    | 'time'
    | 'check'
    | 'state'
    | 'play'
    | 'pause'
    | 'clock'
    | 'holiday'
    | 'vacation'
    | 'ticket'
    | 'arrow-left'
    | 'arrow-right'
    | 'text'
    | 'building'
    | 'document'
    | 'people';
  color?: string;
  text?: string;
  size?: number;
  fontColor?: string;
  backgroundColor?: string;
};
