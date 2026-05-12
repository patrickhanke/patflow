import colors from '../context/Theme/constants/constantColors';

const transformToColor = (color?: string) => {
  switch (color) {
    case 'info':
      return colors.blue;
    case 'warning':
      return colors.yellow;
    case 'success':
      return colors.green;
    case 'approved':
      return colors.green;
    case 'created':
      return 'gray';
    case 'submitted':
      return colors.yellow;
    default:
      return 'gray';
  }
};

export default transformToColor;
