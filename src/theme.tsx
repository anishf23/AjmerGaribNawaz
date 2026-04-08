import React, { createContext, useContext, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedThemeMode = 'light' | 'dark';
export type ColorTheme = 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'red';

export type AppThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  surfaceStrong: string;
  border: string;
  borderSoft: string;
  text: string;
  textMuted: string;
  textSoft: string;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  accentContrast: string;
  tabBar: string;
  shadow: string;
  orbPrimary: string;
  orbSecondary: string;
  successSurface: string;
};

export type AppTheme = {
  mode: ThemeMode;
  resolvedMode: ResolvedThemeMode;
  colorTheme: ColorTheme;
  colors: AppThemeColors;
  setMode: (mode: ThemeMode) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
};

const lightColors: AppThemeColors = {
  // brand-related color for light theme, adapted from #cf7f0fff
  // this can be reused where accent is needed or to keep harmony
  // across the entire light palette.
  // If you want one color family to drive all, change the values below.
  background: '#f8f6f3ff',
  surface: '#FFFFFFF0',
  surfaceMuted: '#F2F8F4',
  surfaceStrong: '#FFFFFF',
  border: '#D5E8DE',
  borderSoft: '#E8F1EC',
  text: '#12362B',
  textMuted: '#4E675F',
  textSoft: '#6B8079',
  accent: '#cf7f0fff',
  accentStrong: '#a8640dcc',
  accentSoft: '#f3e7d9',
  accentContrast: '#FFFFFF',
  tabBar: '#FCFEFD',
  shadow: '#103329',
  orbPrimary: '#DCEFE5',
  orbSecondary: '#E7F5EF',
  successSurface: '#ECFDF3',
};

const darkColors: AppThemeColors = {
  background: '#000000',
  surface: '#111111',
  surfaceMuted: '#1A1A1A',
  surfaceStrong: '#242424',
  border: '#2F2F2F',
  borderSoft: '#1F1F1F',
  text: '#F5F5F5',
  textMuted: '#C9C9C9',
  textSoft: '#9A9A9A',
  accent: '#FFFFFF',
  accentStrong: '#E5E5E5',
  accentSoft: '#1C1C1C',
  accentContrast: '#000000',
  tabBar: '#0A0A0A',
  shadow: '#000000',
  orbPrimary: '#161616',
  orbSecondary: '#0D0D0D',
  successSurface: '#121212',
};

// Color themes for light mode
const blueTheme: AppThemeColors = {
  ...lightColors,
  accent: '#2563eb',
  accentStrong: '#1d4ed8',
  accentSoft: '#dbeafe',
  accentContrast: '#FFFFFF',
  orbPrimary: '#dbeafe',
  orbSecondary: '#eff6ff',
};

const greenTheme: AppThemeColors = {
  ...lightColors,
  accent: '#16a34a',
  accentStrong: '#15803d',
  accentSoft: '#dcfce7',
  accentContrast: '#FFFFFF',
  orbPrimary: '#dcfce7',
  orbSecondary: '#f0fdf4',
};

const purpleTheme: AppThemeColors = {
  ...lightColors,
  accent: '#9333ea',
  accentStrong: '#7c3aed',
  accentSoft: '#f3e8ff',
  accentContrast: '#FFFFFF',
  orbPrimary: '#f3e8ff',
  orbSecondary: '#faf5ff',
};

const orangeTheme: AppThemeColors = {
  ...lightColors,
  accent: '#ea580c',
  accentStrong: '#c2410c',
  accentSoft: '#fed7aa',
  accentContrast: '#FFFFFF',
  orbPrimary: '#fed7aa',
  orbSecondary: '#fff7ed',
};

const redTheme: AppThemeColors = {
  ...lightColors,
  accent: '#dc2626',
  accentStrong: '#b91c1c',
  accentSoft: '#fecaca',
  accentContrast: '#FFFFFF',
  orbPrimary: '#fecaca',
  orbSecondary: '#fef2f2',
};

const colorThemes: Record<ColorTheme, AppThemeColors> = {
  default: lightColors,
  blue: blueTheme,
  green: greenTheme,
  purple: purpleTheme,
  orange: orangeTheme,
  red: redTheme,
};

const ThemeContext = createContext<AppTheme | null>(null);

function getResolvedMode(mode: ThemeMode, deviceScheme: ColorSchemeName): ResolvedThemeMode {
  if (mode === 'system') {
    return deviceScheme === 'dark' ? 'dark' : 'light';
  }
  return mode;
}

type AppThemeProviderProps = {
  children: React.ReactNode;
};

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const deviceScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('default');
  const resolvedMode = getResolvedMode(mode, deviceScheme);

  const colors = useMemo(() => {
    if (resolvedMode === 'dark') {
      return darkColors;
    }
    return colorThemes[colorTheme];
  }, [resolvedMode, colorTheme]);

  const value = useMemo<AppTheme>(
    () => ({
      mode,
      resolvedMode,
      colorTheme,
      colors,
      setMode,
      setColorTheme,
    }),
    [mode, resolvedMode, colorTheme, colors],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used inside AppThemeProvider');
  }

  return context;
}
