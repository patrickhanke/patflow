import React, { createContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import colors from './constants/colors';
import applicationStyles from './styles/Application';
import { ThemeContextProps, ThemeState } from './types';
import constantColors from './constants/constantColors';

export const ThemeContext = createContext(
  undefined as unknown as ThemeContextProps
);

const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = Appearance.getColorScheme();

  const [theme, setTheme] = useState<ThemeState>(
    colorScheme
      ? {
          theme: colorScheme,
          colors: colors[colorScheme]
        }
      : {
          theme: 'light',
          colors: colors.light
        }
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(
        colorScheme
          ? {
              theme: colorScheme,
              colors: colors[colorScheme]
            }
          : {
              theme: 'light',
              colors: colors.light
            }
      );
    });

    return () => subscription.remove();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        constantColors: constantColors,
        themeColors: theme.colors,
        theme: theme.theme,
        applicationStyles: useMemo(
          () => applicationStyles(theme.theme),
          [colorScheme]
        )
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
