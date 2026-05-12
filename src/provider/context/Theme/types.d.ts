import constantColors from './constants/constantColors';
import applicationStyles from './styles/Application';
import { Theme } from './types.d';
export type Theme = 'light' | 'dark';

export type ConstantColorKeys = keyof typeof constantColors;

export type ColorKey =
  | 'background'
  | 'text'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'border'
  | 'disabled'
  | 'dark'
  | 'light'
  | 'dark_font'
  | 'light_font'
  | 'light_background'
  | 'button'
  | ConstantColorKeys;

export type Colors = Record<Theme, Record<ColorKey, string>>;

export type CreateColor = (key: ColorKey, theme: Theme) => string;

export type ThemeColors = Colors[Theme];

export type ThemeState = {
  theme: Theme;
  colors: Colors[Theme];
};

type ThemeContextProps = {
  constantColors: typeof constantColors;
  themeColors: Record<ColorKey, string>;
  theme: ThemeState['theme'];
  applicationStyles: ReturnType<typeof applicationStyles>;
};
