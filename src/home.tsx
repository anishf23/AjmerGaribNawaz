import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../App';
import { TranslationKey, useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';
import { getPrayerList, PRAYER_NAMES } from './prayer-utils';

type UrsEventDefinition = {
  name: string;
  startDay: number;
  endDay?: number;
  note?: string;
};

type UrsEvent = {
  name: string;
  islamicDate: string;
  englishDate: string;
  note?: string;
};

type UrsYearBlock = {
  key: string;
  heading: string;
  events: UrsEvent[];
};

type HomeMenu = {
  id: string;
  titleKey: TranslationKey;
  icon: string;
  onPress?: () => void;
};

type DailyAllahName = {
  english: string;
  arabic: string;
  meaning: string;
};

type DailyDua = {
  title: string;
  arabic: string;
  english: string;
};

type DailyQuote = {
  quote: string;
  source: string;
};

const homeMenus: HomeMenu[] = [
  { id: 'name-of-allah', titleKey: 'menu_name_of_allah', icon: '✦' },
  { id: 'islamic-dua', titleKey: 'menu_islamic_dua', icon: '🤲' },
  { id: 'islamic-calendar', titleKey: 'menu_islamic_calendar', icon: '🗓' },
  { id: 'six-kalima', titleKey: 'menu_six_kalima', icon: '☪︎' },
  { id: 'namaz-rakat', titleKey: 'menu_namaz_rakat', icon: '🕌' },
  { id: 'islamic-quotes', titleKey: 'menu_islamic_quotes', icon: '❝' },
  { id: 'quran', titleKey: 'menu_quran', icon: '📖' },
  { id: 'qibla-finder', titleKey: 'menu_qibla_finder', icon: '🧭' },
  { id: 'hadish', titleKey: 'menu_hadish', icon: '🕊' },
  { id: 'tasbih-counter', titleKey: 'menu_tasbih_counter', icon: '📿' },
  { id: 'zakat-calculator', titleKey: 'menu_zakat_calculator', icon: '💰' },
  { id: 'must-visit-place', titleKey: 'menu_must_visit_place', icon: '📍' },
  { id: 'populer-hotels', titleKey: 'menu_populer_hotels', icon: '🏨' },
  { id: 'hajj-umrah-guide', titleKey: 'menu_hajj_umrah_guide', icon: '🕋' },
  { id: 'nearby-places', titleKey: 'menu_nearby_places', icon: '📍' },
  { id: 'takti', titleKey: 'menu_takti', icon: '✍️' },
];

const HIJRI_MONTH_NAME = 'Rajab';
const URS_HIJRI_MONTH = 7;
const URS_MAIN_DAY = 6;
const GREGORIAN_DISPLAY_TIMEZONE = 'UTC';
const PRAYER_TRACKER_INDEX_KEY = 'PRAYER_TRACKER_INDEX';
const PRAYER_TRACKER_PREFIX = 'PRAYER_TRACKER_';

const ursEventDefinitions: UrsEventDefinition[] = [
  { name: 'Start of Urs', startDay: 1 },
  { name: 'Flag Hoisting (Jhanda Ceremony)', startDay: 1 },
  { name: 'Mehfil, Qawwali, Religious Gatherings', startDay: 2, endDay: 5 },
  {
    name: 'Main Urs Day',
    startDay: 6,
    note: 'Khwaja Garib Nawaz Urs day',
  },
  { name: 'Ghusl Ceremony', startDay: 9 },
  { name: 'End of Urs', startDay: 9 },
];

const dailyAllahNames: DailyAllahName[] = [
  { english: 'Ar-Rahman', arabic: 'الرَّحْمَن', meaning: 'The Most Compassionate' },
  { english: 'Ar-Rahim', arabic: 'الرَّحِيم', meaning: 'The Most Merciful' },
  { english: 'Al-Malik', arabic: 'الْمَلِك', meaning: 'The King' },
  { english: 'Al-Quddus', arabic: 'الْقُدُّوس', meaning: 'The Most Holy' },
  { english: 'As-Salam', arabic: 'السَّلاَم', meaning: 'The Source of Peace' },
];

const dailyDuas: DailyDua[] = [
  {
    title: 'For Guidance',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    english: 'Rabbi zidni ilma',
  },
  {
    title: 'For Parents',
    arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    english: 'Rabbir hamhuma kama rabbayani saghira',
  },
  {
    title: 'Before Sleeping',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    english: 'Bismika Allahumma amutu wa ahya',
  },
  {
    title: 'Entering the Masjid',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    english: 'Allahumma iftah li abwaba rahmatik',
  },
];

const dailyQuotes: DailyQuote[] = [
  { quote: 'Indeed, with hardship comes ease.', source: 'Quran 94:6' },
  { quote: 'Do not despair of the mercy of Allah.', source: 'Quran 39:53' },
  { quote: 'Verily, in the remembrance of Allah do hearts find rest.', source: 'Quran 13:28' },
  {
    quote: 'The best among you are those who have the best manners and character.',
    source: 'Sahih al-Bukhari',
  },
];

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function getOrdinal(day: number): string {
  const mod100 = day % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${day}th`;
  if (day % 10 === 1) return `${day}st`;
  if (day % 10 === 2) return `${day}nd`;
  if (day % 10 === 3) return `${day}rd`;
  return `${day}th`;
}

function hijriToJulianDay(year: number, month: number, day: number): number {
  return (
    day +
    Math.ceil(29.5 * (month - 1)) +
    (year - 1) * 354 +
    Math.floor((3 + 11 * year) / 30) +
    1948439 -
    1
  );
}

function julianDayToGregorianDate(julianDay: number): Date {
  let l = julianDay + 68569;
  const n = Math.floor((4 * l) / 146097);
  l -= Math.floor((146097 * n + 3) / 4);
  const i = Math.floor((4000 * (l + 1)) / 1461001);
  l = l - Math.floor((1461 * i) / 4) + 31;
  const j = Math.floor((80 * l) / 2447);
  const day = l - Math.floor((2447 * j) / 80);
  l = Math.floor(j / 11);
  const month = j + 2 - 12 * l;
  const year = 100 * (n - 49) + i + l;

  return new Date(Date.UTC(year, month - 1, day));
}

function hijriToGregorianDate(year: number, month: number, day: number): Date {
  return julianDayToGregorianDate(hijriToJulianDay(year, month, day));
}

function formatGregorianDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: GREGORIAN_DISPLAY_TIMEZONE,
  }).format(date);
}

function getInitialUpcomingHijriYear(today: Date): number {
  for (let hijriYear = 1440; hijriYear <= 1600; hijriYear += 1) {
    const mainDayDate = hijriToGregorianDate(hijriYear, URS_HIJRI_MONTH, URS_MAIN_DAY);
    if (mainDayDate >= today) {
      return hijriYear;
    }
  }
  return 1447;
}

function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const styles = createStyles(colors);
  const cardWidth = width - 56;
  const [todayPrayerStatus, setTodayPrayerStatus] = useState<Record<string, boolean>>(
    () => PRAYER_NAMES.reduce((acc, name) => ({ ...acc, [name]: false }), {} as Record<string, boolean>),
  );
  const todayDateKey = useMemo(() => {
    const today = new Date();
    return `${PRAYER_TRACKER_PREFIX}${today.toISOString().slice(0, 10)}`;
  }, []);
  const todayPrayers = useMemo(() => getPrayerList(new Date()), []);

  const [nextPrayerName, nextPrayerTime] = useMemo(() => {
    const now = new Date();
    const upcoming = todayPrayers.find(prayer => prayer.time > now);
    if (upcoming) {
      return [upcoming.name, upcoming.time];
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const first = getPrayerList(tomorrow)[0];
    return [first.name, first.time];
  }, [todayPrayers]);

  const now = new Date();

  const loadTodayPrayerStatus = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(todayDateKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, boolean>;
      setTodayPrayerStatus(prev => ({ ...prev, ...parsed }));
    } catch (error) {
      console.warn('Failed to load today prayer tracker', error);
    }
  }, [todayDateKey]);

  const storeTodayPrayerStatus = useCallback(
    async (updated: Record<string, boolean>) => {
      try {
        await AsyncStorage.setItem(todayDateKey, JSON.stringify(updated));
        const indexRaw = await AsyncStorage.getItem(PRAYER_TRACKER_INDEX_KEY);
        const index = indexRaw ? (JSON.parse(indexRaw) as string[]) : [];
        if (!index.includes(todayDateKey)) {
          const next = [todayDateKey, ...index];
          await AsyncStorage.setItem(PRAYER_TRACKER_INDEX_KEY, JSON.stringify(next));
        }
      } catch (error) {
        console.warn('Failed to store prayer tracker status', error);
      }
    },
    [todayDateKey],
  );

  useEffect(() => {
    loadTodayPrayerStatus();
  }, [loadTodayPrayerStatus]);

  const togglePrayer = async (prayerName: string) => {
    const nextStatus = { ...todayPrayerStatus, [prayerName]: !todayPrayerStatus[prayerName] };
    setTodayPrayerStatus(nextStatus);
    await storeTodayPrayerStatus(nextStatus);
  };

  const [dailyAllahName, setDailyAllahName] = useState(() =>
    getRandomItem(dailyAllahNames),
  );
  const [dailyDua, setDailyDua] = useState(() => getRandomItem(dailyDuas));
  const [dailyQuote, setDailyQuote] = useState(() => getRandomItem(dailyQuotes));

  const refreshDailyPicks = useCallback(() => {
    setDailyAllahName(getRandomItem(dailyAllahNames));
    setDailyDua(getRandomItem(dailyDuas));
    setDailyQuote(getRandomItem(dailyQuotes));
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshDailyPicks();
    }, [refreshDailyPicks]),
  );

  const openUrl = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert(t('common_unable_open'), t('common_link_unsupported'));
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert(t('common_something_wrong'), t('common_try_again'));
    }
  };

  const onRateApp = async () => {
    const packageId = 'com.mygni';
    const marketUrl = `market://details?id=${packageId}`;
    const webUrl = `https://play.google.com/store/apps/details?id=${packageId}`;
    const canOpenMarket = await Linking.canOpenURL(marketUrl);
    if (canOpenMarket) {
      await openUrl(marketUrl);
      return;
    }
    await openUrl(webUrl);
  };

  const homeMenusWithActions = useMemo<HomeMenu[]>(
    () =>
      homeMenus.map(menu =>
        menu.id === 'name-of-allah'
          ? {
              ...menu,
              onPress: () => navigation.navigate('NameOfAllah'),
            }
          : menu.id === 'islamic-dua'
            ? {
                ...menu,
                onPress: () => navigation.navigate('IslamicDua'),
              }
          : menu.id === 'islamic-calendar'
            ? {
                ...menu,
                onPress: () => navigation.navigate('IslamicCalendar'),
              }
          : menu.id === 'six-kalima'
            ? {
                ...menu,
                onPress: () => navigation.navigate('SixKalima'),
              }
          : menu.id === 'namaz-rakat'
            ? {
                ...menu,
                onPress: () => navigation.navigate('NamazRakat'),
              }
          : menu.id === 'islamic-quotes'
            ? {
                ...menu,
                onPress: () => navigation.navigate('IslamicQuotes'),
              }
          : menu.id === 'quran'
            ? {
                ...menu,
                onPress: () =>
                  navigation.navigate('MainTabs', {
                    screen: 'Quran',
                  }),
              }
          : menu.id === 'qibla-finder'
            ? {
                ...menu,
                onPress: () => navigation.navigate('QiblaFinder'),
              }
          : menu.id === 'hadish'
            ? {
                ...menu,
                onPress: () => navigation.navigate('IslamicHadish'),
              }
          : menu.id === 'tasbih-counter'
            ? {
                ...menu,
                onPress: () => navigation.navigate('TasbihCounter'),
              }
          : menu.id === 'zakat-calculator'
            ? {
                ...menu,
                onPress: () => navigation.navigate('ZakatCalculator'),
              }
          : menu.id === 'must-visit-place'
            ? {
                ...menu,
                onPress: () => navigation.navigate('MustVisitPlace'),
              }
          : menu.id === 'populer-hotels'
            ? {
                ...menu,
                onPress: () => navigation.navigate('HotelsNearDargah'),
              }
          : menu.id === 'hajj-umrah-guide'
            ? {
                ...menu,
                onPress: () => navigation.navigate('HajjUmrahGuide'),
              }
          : menu.id === 'nearby-places'
            ? {
                ...menu,
                onPress: () => navigation.navigate('NearbyPlaces'),
              }
          : menu.id === 'takti'
            ? {
                ...menu,
                onPress: () => navigation.navigate('Takti'),
              }
          : menu,
      ),
    [navigation],
  );

  const nextUrsBlock = useMemo<UrsYearBlock>(() => {
    const currentDate = new Date();
    const hijriYear = getInitialUpcomingHijriYear(currentDate);

    const events = ursEventDefinitions.map(event => {
      const startDate = hijriToGregorianDate(
        hijriYear,
        URS_HIJRI_MONTH,
        event.startDay,
      );
      const endDay = event.endDay ?? event.startDay;
      const endDate = hijriToGregorianDate(hijriYear, URS_HIJRI_MONTH, endDay);

      const islamicDate =
        event.endDay && event.endDay !== event.startDay
          ? `${getOrdinal(event.startDay)}-${getOrdinal(event.endDay)} ${HIJRI_MONTH_NAME} ${hijriYear} AH`
          : `${getOrdinal(event.startDay)} ${HIJRI_MONTH_NAME} ${hijriYear} AH`;

      const englishDate =
        event.endDay && event.endDay !== event.startDay
          ? `${formatGregorianDate(startDate)} - ${formatGregorianDate(endDate)} (Approx.)`
          : `${formatGregorianDate(startDate)} (Approx.)`;

      return {
        name: event.name,
        islamicDate,
        englishDate,
        note: event.note,
      };
    });

    const mainDayDate = hijriToGregorianDate(hijriYear, URS_HIJRI_MONTH, URS_MAIN_DAY);
    const gregorianYear = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      timeZone: GREGORIAN_DISPLAY_TIMEZONE,
    }).format(mainDayDate);

    return {
      key: String(hijriYear),
      heading: `Urs ${gregorianYear} (Approx.) • Rajab ${hijriYear} AH`,
      events,
    };
  }, []);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bgOrbTop} />
        <View style={styles.bgOrbRight} />
        <View style={styles.headerWrap}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerTextWrap}>
              <Text style={styles.kicker}>{t('home_kicker')}</Text>
              <Text style={styles.title}>{t('home_title')}</Text>
            </View>
            <Pressable
              style={styles.aiButton}
              onPress={() => navigation.navigate('DeenAI')}
              accessibilityRole="button"
              accessibilityLabel="Open Deen AI"
            >
              <View style={styles.aiButtonGlow} />
              <View style={styles.aiButtonInnerRing}>
                <Image
                  source={require('../assets/images/ai.png')}
                  style={styles.aiButtonIcon}
                  resizeMode="contain"
                />
              </View>
            </Pressable>
          </View>
          <Text style={styles.subtitle}>{t('home_subtitle')}</Text>
        </View>

        <View key={nextUrsBlock.key} style={styles.nextUrsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home_upcoming_urs')}</Text>
            <Text style={styles.sectionBadge}>{t('home_ajmer_shareef')}</Text>
          </View>
          <Text style={styles.sectionSubTitle}>{nextUrsBlock.heading}</Text>
          <ScrollView
            horizontal
            pagingEnabled
            snapToInterval={cardWidth + 12}
            decelerationRate="fast"
            contentContainerStyle={styles.horizontalContent}
            showsHorizontalScrollIndicator={false}
          >
            {nextUrsBlock.events.map(event => (
              <View
                key={`${nextUrsBlock.key}-${event.name}`}
                style={[styles.card, { width: cardWidth }]}
              >
                <Text style={styles.eventName}>{event.name}</Text>
                <View style={styles.metaBox}>
                  <Text style={styles.rowLabel}>Islamic Date</Text>
                  <Text style={styles.rowValue}>{event.islamicDate}</Text>
                </View>
                <View style={styles.metaBox}>
                  <Text style={styles.rowLabel}>English Date</Text>
                  <Text style={styles.rowValue}>{event.englishDate}</Text>
                </View>
                {event.note ? <Text style={styles.note}>{event.note}</Text> : null}
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{t('home_explore_menu')}</Text>
          <View style={styles.menuGrid}>
            {homeMenusWithActions.map(menu => (
              <Pressable
                key={menu.id}
                style={styles.menuCard}
                onPress={menu.onPress}
                disabled={!menu.onPress}
              >
                <View style={styles.menuIconCircle}>
                  <Text style={styles.menuIcon}>{menu.icon}</Text>
                </View>
                <Text style={styles.menuText}>{t(menu.titleKey)}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.prayerTrackerCard}>
          <Text style={styles.prayerTrackerTitle}>Prayer Tracker</Text>
          <Text style={styles.prayerTrackerSubtitle}>
            Next prayer: {nextPrayerName} at {nextPrayerTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.prayerButtonsRow}
          >
            {todayPrayers.map(prayer => {
              const prayerName = prayer.name;
              const error = new Date(prayer.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const isAvailable = now.getTime() >= prayer.time.getTime();
              const done = !!todayPrayerStatus[prayerName];
              return (
                <Pressable
                  key={prayerName}
                  style={[
                    styles.prayerChip,
                    {
                      backgroundColor: done
                        ? colors.accent
                        : isAvailable
                        ? colors.surface
                        : colors.surfaceMuted,
                      borderColor: isAvailable ? colors.accent : colors.border,
                    },
                  ]}
                  onPress={() => {
                    if (!isAvailable) {
                      return;
                    }
                    togglePrayer(prayerName);
                  }}
                >
                  <Text
                      style={[
                        styles.prayerChipTitle,
                        { color: done ? colors.accentContrast : isAvailable ? colors.text : colors.textMuted },
                      ]}
                  >
                    {prayerName} {error}
                  </Text>
                    <Text
                      style={[
                        styles.prayerChipSubtext,
                        { color: done ? colors.accentContrast : colors.textMuted },
                      ]}
                    >
                    {done ? 'Done' : isAvailable ? 'Mark' : 'Future'}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Pressable
            style={[styles.prayerTrackerButton, { marginTop: 10 }]}
            onPress={() => navigation.navigate('PrayerTracker')}
          >
            <Text style={styles.prayerTrackerButtonText}>View all tracker records</Text>
          </Pressable>
        </View>

        <View style={styles.dailySection}>
          <Text style={styles.dailySectionTitle}>{t('home_daily_picks')}</Text>

          <View style={styles.dailyCard}>
            <Text style={styles.dailyKicker}>{t('home_name_of_day')}</Text>
            <Text style={styles.dailyTitle}>{dailyAllahName.english}</Text>
            <Text style={styles.dailyArabic}>{dailyAllahName.arabic}</Text>
            <Text style={styles.dailyBody}>{dailyAllahName.meaning}</Text>
          </View>

          <View style={styles.dailyCard}>
            <Text style={styles.dailyKicker}>{t('home_dua_of_day')}</Text>
            <Text style={styles.dailyTitle}>{dailyDua.title}</Text>
            <Text style={styles.dailyArabic}>{dailyDua.arabic}</Text>
            <Text style={styles.dailyBody}>{dailyDua.english}</Text>
          </View>

          <View style={styles.dailyCard}>
            <Text style={styles.dailyKicker}>{t('home_quote_of_day')}</Text>
            <Text style={styles.dailyQuoteText}>{dailyQuote.quote}</Text>
            <Text style={styles.dailyQuoteSource}>{dailyQuote.source}</Text>
          </View>

          <Pressable style={styles.rateCard} onPress={onRateApp}>
            <View style={styles.rateTopRow}>
              <Text style={styles.rateIcon}>⭐</Text>
              <Text style={styles.rateTitle}>{t('home_rate_title')}</Text>
            </View>
            <Text style={styles.rateText}>{t('home_rate_text')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    bgOrbTop: {
      position: 'absolute',
      top: -120,
      left: -60,
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: colors.orbPrimary,
    },
    bgOrbRight: {
      position: 'absolute',
      top: 20,
      right: -50,
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: colors.orbSecondary,
    },
    pageContent: {
      paddingBottom: 108,
    },
    headerWrap: {
      paddingTop: 16,
      paddingHorizontal: 18,
      paddingBottom: 8,
    },
    headerTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
    },
    headerTextWrap: {
      flex: 1,
    },
    kicker: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.1,
      color: colors.accent,
      marginBottom: 6,
    },
    title: {
      fontSize: 30,
      fontWeight: '800',
      color: colors.text,
    },
    subtitle: {
      marginTop: 4,
      fontSize: 13,
      color: colors.textMuted,
      lineHeight: 19,
    },
    aiButton: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.14,
      shadowRadius: 16,
      elevation: 4,
    },
    aiButtonGlow: {
      position: 'absolute',
      top: -10,
      left: 8,
      width: 40,
      height: 24,
      borderRadius: 999,
      backgroundColor: colors.accent,
      opacity: 0.24,
    },
    aiButtonInnerRing: {
      width: 38,
      height: 38,
      borderRadius: 19,
      borderWidth: 1,
      borderColor: colors.borderSoft,
      backgroundColor: colors.surfaceStrong,
      alignItems: 'center',
      justifyContent: 'center',
    },
    aiButtonIcon: {
      width: 20,
      height: 20,
      tintColor: colors.accent,
    },
    section: {
      marginBottom: 14,
    },
    nextUrsSection: {
      marginBottom: 6,
    },
    sectionHeader: {
      paddingHorizontal: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sectionTitle: {
      fontSize: 19,
      fontWeight: '800',
      color: colors.text,
    },
    sectionBadge: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.accent,
      backgroundColor: colors.accentSoft,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
    },
    sectionSubTitle: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 4,
      marginBottom: 10,
      paddingHorizontal: 18,
    },
    horizontalContent: {
      paddingHorizontal: 18,
      paddingBottom: 8,
      gap: 12,
    },
    menuSection: {
      paddingHorizontal: 18,
      paddingBottom: 16,
    },
    menuSectionTitle: {
      fontSize: 19,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 10,
    },
    menuGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    menuCard: {
      width: '48%',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 14,
      marginBottom: 10,
      minHeight: 86,
      justifyContent: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
      elevation: 2,
    },
    menuIconCircle: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accentSoft,
      marginBottom: 8,
    },
    menuIcon: {
      fontSize: 16,
    },
    menuText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      lineHeight: 20,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
      paddingVertical: 14,
      marginBottom: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 7 },
      shadowOpacity: 0.07,
      shadowRadius: 14,
      elevation: 3,
    },
    eventName: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 12,
    },
    metaBox: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 10,
      paddingVertical: 9,
      marginBottom: 8,
    },
    rowLabel: {
      fontSize: 12,
      color: colors.textSoft,
    },
    rowValue: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      marginTop: 3,
    },
    note: {
      marginTop: 2,
      fontSize: 12,
      color: colors.accent,
      fontWeight: '700',
    },
    dailySection: {
      paddingHorizontal: 18,
      paddingBottom: 22,
      gap: 10,
    },
    dailySectionTitle: {
      fontSize: 19,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 2,
    },
    dailyCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
      elevation: 2,
    },
    dailyKicker: {
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1,
      color: colors.accent,
      marginBottom: 6,
    },
    dailyTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
    },
    dailyArabic: {
      marginTop: 8,
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'right',
    },
    dailyBody: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 21,
      color: colors.textMuted,
    },
    dailyQuoteText: {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '700',
      color: colors.text,
    },
    dailyQuoteSource: {
      marginTop: 10,
      fontSize: 13,
      color: colors.textMuted,
      fontStyle: 'italic',
    },
    prayerTrackerCard: {
      width: undefined,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: 16,
      marginHorizontal: 15,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.07,
      shadowRadius: 14,
      elevation: 3,
    },
    prayerTrackerTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 4,
    },
    prayerTrackerSubtitle: {
      color: colors.textMuted,
      marginBottom: 10,
      fontSize: 13,
    },
    prayerButtonsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      marginBottom: 12,
    },
    prayerChip: {
      minWidth: 70,
      maxWidth: 90,
      width: 86,
      paddingHorizontal: 6,
      paddingVertical: 4,
      height: 38,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 4,
    },
    prayerChipTitle: {
      fontSize: 10,
      fontWeight: '700',
      lineHeight: 12,
      textAlign: 'center',
    },
    prayerChipSubtext: {
      fontSize: 8,
      fontWeight: '700',
      lineHeight: 10,
      marginTop: 2,
      textAlign: 'center',
    },
    prayerTrackerButton: {
      backgroundColor: colors.accent,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      alignItems: 'center',
    },
    prayerTrackerButtonText: {
      color: colors.accentContrast,
      fontWeight: '700',
    },
    rateCard: {
      backgroundColor: colors.accentSoft,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
    },
    rateTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    rateIcon: {
      fontSize: 20,
    },
    rateTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
    },
    rateText: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 21,
      color: colors.textMuted,
    },
  });

export default Home;
