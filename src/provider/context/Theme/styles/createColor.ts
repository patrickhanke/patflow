import colors from '../constants/colors';
import { CreateColor } from '../types';

const createColor: CreateColor = (key, theme) => {
  return colors[theme][key];
};

export default createColor;
