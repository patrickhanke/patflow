import React from 'react';
import Oct from 'react-native-vector-icons/Octicons';
import Mat from 'react-native-vector-icons/MaterialIcons';
import MatCom from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDes from 'react-native-vector-icons/AntDesign';
import Ion from 'react-native-vector-icons/Ionicons';
import Fea from 'react-native-vector-icons/Feather';
import Fa6 from 'react-native-vector-icons/FontAwesome6';

const iconRender = (icon?: string, size?: number, color?: string) => {
  if (!icon || !size) {
    return null;
  }
  if (icon && color && size) {
    if (icon === 'close') {
      return <AntDes name="close" size={size} color={color} />;
    }
    if (icon === 'property') {
      return <Mat name="house" size={size} color={color} />;
    }
    if (icon === 'description') {
      return <Ion name="document-text-outline" size={size} color={color} />;
    }
    if (icon === 'calendar') {
      return <AntDes name="calendar" size={size} color={color} />;
    }
    if (icon === 'comment') {
      return (
        <MatCom name="comment-multiple-outline" size={size} color={color} />
      );
    }
    if (icon === 'image') {
      return <Oct name="image" size={size} color={color} />;
    }
    if (icon === 'user') {
      return <Fea name="users" size={size} color={color} />;
    }
    if (icon === 'checkbox') {
      return <Ion name="checkbox-outline" size={size} color={color} />;
    }
    if (icon === 'checkbox-blank') {
      return (
        <MatCom
          name="checkbox-blank-circle-outline"
          size={size}
          color={color}
        />
      );
    }
    if (icon === 'check') {
      return <MatCom name="check" size={size} color={color} />;
    }
    if (icon === 'arrow-left') {
      return <Mat name="arrow-back-ios" size={size} color={color} />;
    }
    if (icon === 'time') {
      return <Ion name="timer-outline" size={size} color={color} />;
    }
    if (icon === 'state') {
      return <Oct name="dot" size={size} color={color} />;
    }
    if (icon === 'play') {
      return <Ion name="play-circle-outline" size={size} color={color} />;
    }
    if (icon === 'pause') {
      return <Ion name="pause-circle-outline" size={size} color={color} />;
    }
    if (icon === 'clock') {
      return <AntDes name="clockcircleo" size={size} color={color} />;
    }
    if (icon === 'holiday') {
      return <Ion name="sunny-outline" size={size} color={color} />;
    }
    if (icon === 'vacation') {
      return <Fa6 name="umbrella-beach" size={size} color={color} />;
    }
    if (icon === 'ticket') {
      return <MatCom name="comment-alert-outline" size={size} color={color} />;
    }
    if (icon === 'arrow-right') {
      return <Mat name="arrow-forward-ios" size={size} color={color} />;
    }
    if (icon === 'text') {
      return <Mat name="title" size={size} color={color} />;
    }
    if (icon === 'building') {
      return <Mat name="apartment" size={size} color={color} />;
    }
    if (icon === 'document') {
      return <Ion name="document-text-outline" size={size} color={color} />;
    }
    if (icon === 'people') {
      return <Ion name="people-outline" size={size} color={color} />;
    }
  }
  return null;
};

export default iconRender;
