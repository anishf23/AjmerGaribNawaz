import React from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Home from './home';
import Info from './info';
import { useLocalization } from './localization';
import PrayerTime from './prayer-time';
import Quran from './quran';
import { useAppTheme } from './theme';

type MainTabParamList = {
  Home: undefined;
  PrayerTime: undefined;
  Quran: undefined;
  Info: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, { active: string; inactive: string }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  PrayerTime: { active: 'time', inactive: 'time-outline' },
  Quran: { active: 'book', inactive: 'book-outline' },
  Info: { active: 'information-circle', inactive: 'information-circle-outline' },
};

function rgba(hex: string, alpha: number) {
  const sanitized = hex.replace('#', '');
  const value =
    sanitized.length === 3
      ? sanitized
          .split('')
          .map(char => char + char)
          .join('')
      : sanitized;

  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function GlassyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors, resolvedMode } = useAppTheme();
  const styles = createStyles(colors, resolvedMode === 'dark', insets.bottom);

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <View style={styles.shell}>
        <View style={styles.glowLeft} />
        <View style={styles.glowRight} />
        <View style={styles.innerBar}>
          {state.routes.map((route, index) => {
            const descriptor = descriptors[route.key];
            const isFocused = state.index === index;
            const iconName = isFocused
              ? tabIcons[route.name as keyof MainTabParamList].active
              : tabIcons[route.name as keyof MainTabParamList].inactive;

            const label =
              typeof descriptor.options.title === 'string'
                ? descriptor.options.title
                : route.name;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                style={[styles.tabButton, isFocused ? styles.tabButtonActive : null]}
              >
                <View style={[styles.iconWrap, isFocused ? styles.iconWrapActive : null]}>
                  <Icon
                    name={iconName}
                    size={20}
                    color={isFocused ? colors.accentContrast : colors.textSoft}
                  />
                </View>
                <Text
                  style={[
                    styles.tabLabel,
                    isFocused ? styles.tabLabelActive : null,
                  ]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function renderGlassyTabBar(props: BottomTabBarProps) {
  return <GlassyTabBar {...props} />;
}

function MainTabs() {
  const { t } = useLocalization();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={renderGlassyTabBar}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tab.Screen name="Home" component={Home} options={{ title: t('tabs_home') }} />
      <Tab.Screen
        name="PrayerTime"
        component={PrayerTime}
        options={{ title: t('tabs_prayer_time') }}
      />
      <Tab.Screen name="Quran" component={Quran} options={{ title: t('tabs_quran') }} />
      <Tab.Screen name="Info" component={Info} options={{ title: t('tabs_info') }} />
    </Tab.Navigator>
  );
}

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors'], isDark: boolean, bottomInset: number) =>
  StyleSheet.create({
    wrapper: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingBottom: Math.max(bottomInset, 6) + 8,
    },
    shell: {
      width: Dimensions.get('screen').width-20,
      //maxWidth: 368,
      borderRadius: 44,
      padding: 5,
      backgroundColor: isDark
        ? rgba(colors.surfaceStrong, 0.88)
        : rgba('#FFFFFF', 0.82),
      borderWidth: 1,
      borderColor: isDark ? rgba('#FFFFFF', 0.08) : rgba(colors.border, 0.8),
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.35 : 0.14,
      shadowRadius: 16,
      elevation: 12,
      overflow: 'hidden',
    },
    glowLeft: {
      position: 'absolute',
      top: -26,
      left: 28,
      width: 110,
      height: 72,
      borderRadius: 999,
      backgroundColor: rgba(colors.accent, isDark ? 0.12 : 0.18),
    },
    glowRight: {
      position: 'absolute',
      right: 20,
      bottom: -24,
      width: 92,
      height: 64,
      borderRadius: 999,
      backgroundColor: isDark
        ? rgba('#FFFFFF', 0.06)
        : rgba(colors.accentStrong, 0.1),
    },
    innerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 6,
    },
    tabButton: {
      flex: 1,
      minHeight: 56,
      borderRadius: 38,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
      paddingVertical: 6,
    },
    tabButtonActive: {
      backgroundColor: isDark
        ? rgba('#FFFFFF', 0.12)
        : rgba(colors.accent, 0.14),
      borderWidth: 1,
      borderColor: isDark
        ? rgba('#FFFFFF', 0.12)
        : rgba(colors.accent, 0.16),
    },
    iconWrap: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 3,
    },
    iconWrapActive: {
      backgroundColor: colors.accent,
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.28 : 0.18,
      shadowRadius: 10,
      elevation: 2,
    },
    tabLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.textSoft,
    },
    tabLabelActive: {
      color: colors.text,
    },
  });

export default MainTabs;
