import constantColors from './constantColors';

const colors = {
  dark: {
    dark_font: '#292B2D',
    background: '#1e1f21',
    text: '#ffffff',
    light_font: '#7d7e82',
    primary: constantColors.blue,
    secondary: 'F6E988',
    tertiary: '#5894a7',
    disabled: '#7d7e82',
    border: '#535457',
    dark: '#121314',
    light: '#25272a',
    light_background: '#25272a',
    ...constantColors
  },
  light: {
    dark_font: '#292B2D',
    background: constantColors.white,
    text: '#292B2D',
    light_font: '#a4a6ab',
    primary: constantColors.blue,
    secondary: '#FFE11A',
    tertiary: '#5894a7',
    disabled: '#49505740',
    border: '#c2c3c6',
    dark: '#333333',
    light: '#f2f2f2',
    light_background: '#F9F9F9',
    ...constantColors
  }
};

export default colors;
