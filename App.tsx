/**
 * @format
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native';
import DeenAI from './src/DeenAI';
import Takti from './src/Takti';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Introduction from './src/introduction';
import PrayerTracker from './src/PrayerTracker';
import HajjUmrahGuide from './src/HajjUmrahGuide';
import HotelsNearDargah from './src/HotelsNearDargah';
import IslamicHadish from './src/IslamicHadish';
import IslamicDua from './src/islamicDua';
import IslamicCalendar from './src/islamicCalendar';
import IslamicQuotes from './src/IslamicQuotes';
import MainTabs from './src/main-tabs';
import MustVisitPlace from './src/MustVisitPlace';
import NamazRakat from './src/NamazRakat';
import NameOfAllah from './src/nameofall';
import NearbyPlaces from './src/NearbyPlaces';
import PrayerSettings from './src/PrayerSettings';
import QiblaFinder from './src/QiblaFinder';
import SixKalima from './src/SixKalima';
import Splash from './src/splash';
import TasbihCounter from './src/TasbihCounter';
import ZakatCalculator from './src/ZakatCalculator';
import { LocalizationProvider } from './src/localization';
import { AppThemeProvider, useAppTheme } from './src/theme';

export type RootStackParamList = {
  Splash: undefined;
  Introduction: undefined;
  MainTabs:
    | NavigatorScreenParams<{
        Home: undefined;
        PrayerTime: undefined;
        Quran: undefined;
        Info: undefined;
      }>
    | undefined;
  NameOfAllah: undefined;
  IslamicDua: undefined;
  IslamicCalendar: undefined;
  SixKalima: undefined;
  IslamicQuotes: undefined;
  IslamicHadish: undefined;
  HajjUmrahGuide: undefined;
  QiblaFinder: undefined;
  TasbihCounter: undefined;
  PrayerSettings: undefined;
  NamazRakat: undefined;
  ZakatCalculator: undefined;
  MustVisitPlace: undefined;
  HotelsNearDargah: undefined;
  PrayerTracker: undefined;
  DeenAI: undefined;
  NearbyPlaces: undefined;
  Takti: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const INTRO_SEEN_KEY = 'INTRODUCTION_SEEN';

function App() {
  return (
    <LocalizationProvider>
      <AppThemeProvider>
        <AppContent />
      </AppThemeProvider>
    </LocalizationProvider>
  );
}

function AppContent() {
  const { colors, resolvedMode } = useAppTheme();
  const isDarkMode = resolvedMode === 'dark';

  const navigationTheme = isDarkMode
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          primary: colors.accent,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          primary: colors.accent,
        },
      };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Splash" component={SplashRoute} />
          <Stack.Screen name="Introduction" component={IntroductionRoute} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="NameOfAllah" component={NameOfAllah} />
          <Stack.Screen name="IslamicDua" component={IslamicDua} />
          <Stack.Screen name="IslamicCalendar" component={IslamicCalendar} />
          <Stack.Screen name="SixKalima" component={SixKalima} />
          <Stack.Screen name="IslamicQuotes" component={IslamicQuotes} />
          <Stack.Screen name="IslamicHadish" component={IslamicHadish} />
          <Stack.Screen name="HajjUmrahGuide" component={HajjUmrahGuide} />
          <Stack.Screen name="QiblaFinder" component={QiblaFinder} />
          <Stack.Screen name="TasbihCounter" component={TasbihCounter} />
          <Stack.Screen name="PrayerSettings" component={PrayerSettings} />
          <Stack.Screen name="NamazRakat" component={NamazRakat} />
          <Stack.Screen name="ZakatCalculator" component={ZakatCalculator} />
          <Stack.Screen name="MustVisitPlace" component={MustVisitPlace} />
          <Stack.Screen name="HotelsNearDargah" component={HotelsNearDargah} />
          <Stack.Screen name="PrayerTracker" component={PrayerTracker} />
          <Stack.Screen name="DeenAI" component={DeenAI} />
          <Stack.Screen name="NearbyPlaces" component={NearbyPlaces} />
          <Stack.Screen name="Takti" component={Takti} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function SplashRoute({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Splash'>) {
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      if (!isMounted) {
        return;
      }
      try {
        const value = await AsyncStorage.getItem(INTRO_SEEN_KEY);
        if (value === 'true') {
          navigation.replace('MainTabs');
        } else {
          navigation.replace('Introduction');
        }
      } catch (error) {
        console.warn('Failure reading intro flag:', error);
        navigation.replace('Introduction');
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [navigation]);

  return <Splash />;
}

function IntroductionRoute({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Introduction'>) {
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(INTRO_SEEN_KEY, 'true');
      } catch (error) {
        console.warn('Failure storing intro flag on mount', error);
      }
    })();
  }, []);

  return <Introduction onDone={() => navigation.replace('MainTabs')} />;
}

export default App;
