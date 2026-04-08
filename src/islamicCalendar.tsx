import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../App';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';

type IslamicDateParts = {
  day: number;
  month: number;
  year: number;
};

type Festival = {
  title: string;
  day?: number;
  month?: number;
  islamicDate: string;
  details: string;
};

type CalendarDay = {
  key: string;
  label: string;
  isCurrentMonth: boolean;
  isToday: boolean;
};

const monthNames = [
  'Muharram',
  'Safar',
  'Rabi al-Awwal',
  'Rabi al-Thani',
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  'Shaban',
  'Ramadan',
  'Shawwal',
  'Dhu al-Qadah',
  'Dhu al-Hijjah',
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const festivals: Festival[] = [
  {
    title: 'Islamic New Year',
    day: 1,
    month: 1,
    islamicDate: '1 Muharram',
    details: 'Beginning of the new Hijri year.',
  },
  {
    title: 'Ashura',
    day: 10,
    month: 1,
    islamicDate: '10 Muharram',
    details: 'A day of reflection, fasting, and remembrance.',
  },
  {
    title: 'Mawlid al-Nabi',
    day: 12,
    month: 3,
    islamicDate: '12 Rabi al-Awwal',
    details: 'Observed by many Muslims as the birth of Prophet Muhammad.',
  },
  {
    title: 'Shab-e-Miraj',
    day: 27,
    month: 7,
    islamicDate: '27 Rajab',
    details: 'Night associated with the Isra and Miraj.',
  },
  {
    title: 'Shab-e-Barat',
    day: 15,
    month: 8,
    islamicDate: '15 Shaban',
    details: 'Night of forgiveness observed in many communities.',
  },
  {
    title: 'Start of Ramadan',
    day: 1,
    month: 9,
    islamicDate: '1 Ramadan',
    details: 'Beginning of the holy month of fasting.',
  },
  {
    title: 'Laylat al-Qadr',
    islamicDate: 'Last 10 nights of Ramadan',
    details: 'The Night of Power is sought in the final nights of Ramadan.',
  },
  {
    title: 'Eid al-Fitr',
    day: 1,
    month: 10,
    islamicDate: '1 Shawwal',
    details: 'Festival marking the end of Ramadan fasting.',
  },
  {
    title: 'Day of Arafah',
    day: 9,
    month: 12,
    islamicDate: '9 Dhu al-Hijjah',
    details: 'A blessed day during the Hajj season.',
  },
  {
    title: 'Eid al-Adha',
    day: 10,
    month: 12,
    islamicDate: '10 Dhu al-Hijjah',
    details: 'Festival of sacrifice commemorating Prophet Ibrahim.',
  },
];

function hijriToJulianDay(year: number, month: number, day: number): number {
  return (
    day +
    Math.ceil(29.5 * (month - 1)) +
    (year - 1) * 354 +
    Math.floor((11 * year + 3) / 30) + // ✅ corrected
    1948439.5 // ✅ use .5 for accuracy
  );
}

function julianDayToGregorianDate(jd: number): Date {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;

  let A = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    A = z + 1 + alpha - Math.floor(alpha / 4);
  }

  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const day = B - D - Math.floor(30.6001 * E) + f;
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  return new Date(Date.UTC(year, month - 1, Math.floor(day)));
}

function hijriToGregorianDate(year: number, month: number, day: number): Date {
  const jd = hijriToJulianDay(year, month, day);
  return julianDayToGregorianDate(jd);
}

function gregorianToJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

function julianDayToHijri(julianDay: number): IslamicDateParts {
  const jd = Math.floor(julianDay) + 0.5;
  const year = Math.floor((30 * (jd - 1948439.5) + 10646) / 10631);
  const month = Math.min(
    12,
    Math.ceil((jd - (29 + hijriToJulianDay(year, 1, 1))) / 29.5) + 1,
  );
  const day = Math.floor(jd - hijriToJulianDay(year, month, 1) + 1);

  return { day, month, year };
}

function getIslamicDateParts(date: Date): IslamicDateParts {
  return julianDayToHijri(gregorianToJulianDay(date));
}

function getMonthLength(year: number, month: number): number {
  const currentMonthStart = hijriToJulianDay(year, month, 1);
  const nextMonth =
    month === 12 ? hijriToJulianDay(year + 1, 1, 1) : hijriToJulianDay(year, month + 1, 1);
  return nextMonth - currentMonthStart;
}

function getDisplayedMonth(offset: number, today: IslamicDateParts) {
  const totalMonths = (today.year - 1) * 12 + (today.month - 1) + offset;
  const year = Math.floor(totalMonths / 12) + 1;
  const month = (totalMonths % 12) + 1;

  return { year, month };
}

function formatGregorianDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function getFestivalGregorianDateForCurrentYear(
  currentHijriYear: number,
  month: number,
  day: number,
  today: Date,
): Date {
  const candidateYears = [
    currentHijriYear - 1,
    currentHijriYear,
    currentHijriYear + 1,
  ];

  const candidateDates = candidateYears.map(year =>
    hijriToGregorianDate(year, month, day),
  );
  const currentGregorianYear = today.getUTCFullYear();
  const sameYearDate = candidateDates.find(
    candidate => candidate.getUTCFullYear() === currentGregorianYear,
  );

  if (sameYearDate) {
    return sameYearDate;
  }

  return candidateDates.reduce((closest, candidate) => {
    const closestDiff = Math.abs(closest.getTime() - today.getTime());
    const candidateDiff = Math.abs(candidate.getTime() - today.getTime());
    return candidateDiff < closestDiff ? candidate : closest;
  });
}

function IslamicCalendar() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const styles = createStyles(colors);
  const [monthOffset, setMonthOffset] = useState(0);

  const todayGregorian = useMemo(() => new Date(), []);
  const todayIslamic = useMemo(() => getIslamicDateParts(todayGregorian), [todayGregorian]);
  const displayedMonth = getDisplayedMonth(monthOffset, todayIslamic);

  const monthLength = getMonthLength(displayedMonth.year, displayedMonth.month);
  const firstGregorianDay = hijriToGregorianDate(displayedMonth.year, displayedMonth.month, 1);
  const startWeekday = firstGregorianDay.getUTCDay();

  const calendarDays = useMemo<CalendarDay[]>(() => {
    const items: CalendarDay[] = [];

    for (let index = 0; index < startWeekday; index += 1) {
      items.push({
        key: `blank-${index}`,
        label: '',
        isCurrentMonth: false,
        isToday: false,
      });
    }

    for (let day = 1; day <= monthLength; day += 1) {
      items.push({
        key: `day-${day}`,
        label: String(day),
        isCurrentMonth: true,
        isToday:
          displayedMonth.year === todayIslamic.year &&
          displayedMonth.month === todayIslamic.month &&
          day === todayIslamic.day,
      });
    }

    while (items.length % 7 !== 0) {
      items.push({
        key: `tail-${items.length}`,
        label: '',
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return items;
  }, [
    displayedMonth.month,
    displayedMonth.year,
    monthLength,
    startWeekday,
    todayIslamic.day,
    todayIslamic.month,
    todayIslamic.year,
  ]);

  const todayLabel = `${todayIslamic.day} ${monthNames[todayIslamic.month - 1]}`;
  const hijriYearLabel = `${todayIslamic.year} AH`;
  const monthLabel = `${monthNames[displayedMonth.month - 1]} ${displayedMonth.year} AH`;
  const todayGregorianLabel = formatGregorianDate(todayGregorian);

  const festivalItems = useMemo(
    () =>
      festivals.map(festival => {
        if (!festival.day || !festival.month) {
          return {
            ...festival,
            englishDate: 'Varies in the last 10 nights',
            festivalDate: null,
          };
        }

        const festivalDate = getFestivalGregorianDateForCurrentYear(
          todayIslamic.year,
          festival.month,
          festival.day,
          todayGregorian,
        );
        const englishDate = formatGregorianDate(festivalDate);

        return {
          ...festival,
          festivalDate,
          englishDate: `${englishDate} (Approx.)`,
        };
      }),
    [todayGregorian, todayIslamic.year],
  );

  const nextFestivalTitle = useMemo(() => {
    const upcomingFestivals = festivalItems
      .filter(
        (
          festival,
        ): festival is typeof festival & {
          festivalDate: Date;
        } => festival.festivalDate instanceof Date,
      )
      .filter(festival => festival.festivalDate.getTime() >= todayGregorian.getTime())
      .sort((a, b) => a.festivalDate.getTime() - b.festivalDate.getTime());

    return upcomingFestivals[0]?.title ?? null;
  }, [festivalItems, todayGregorian]);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.bgOrbA} />
      <View style={styles.bgOrbB} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>{t('common_back')}</Text>
          </Pressable>
          <View style={styles.heroCard}>
            <Text style={styles.kicker}>{t('screen_calendar_kicker')}</Text>
            <Text style={styles.title}>{t('screen_calendar_title')}</Text>
            <Text style={styles.subTitle}>{t('screen_calendar_today')}: {todayLabel} {hijriYearLabel}</Text>
            <Text style={styles.subMeta}>{t('screen_calendar_english_date')}: {todayGregorianLabel}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('screen_calendar_monthly')}</Text>
            <Text style={styles.sectionHint}>{t('screen_calendar_approx')}</Text>
          </View>

          <View style={styles.calendarCard}>
            <View style={styles.monthNavRow}>
              <Pressable
                style={styles.monthNavButton}
                onPress={() => setMonthOffset(value => value - 1)}
              >
                <Text style={styles.monthNavButtonText}>{'<'}</Text>
              </Pressable>
              <Text style={styles.monthTitle}>{monthLabel}</Text>
              <Pressable
                style={styles.monthNavButton}
                onPress={() => setMonthOffset(value => value + 1)}
              >
                <Text style={styles.monthNavButtonText}>{'>'}</Text>
              </Pressable>
            </View>

            <View style={styles.todayBanner}>
              <Text style={styles.todayBannerLabel}>{t('screen_calendar_current_date')}</Text>
              <Text style={styles.todayBannerValue}>
                {todayLabel} {hijriYearLabel}
              </Text>
            </View>

            <View style={styles.weekHeaderRow}>
              {weekDays.map(day => (
                <Text key={day} style={styles.weekHeaderText}>
                  {day}
                </Text>
              ))}
            </View>

            <FlatList
              data={calendarDays}
              keyExtractor={item => item.key}
              scrollEnabled={false}
              numColumns={7}
              renderItem={({ item }) => (
                <View style={styles.dayCell}>
                  <View
                    style={[
                      styles.dayBadge,
                      item.isToday ? styles.todayBadge : null,
                      !item.isCurrentMonth ? styles.emptyBadge : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        item.isToday ? styles.todayText : null,
                        !item.isCurrentMonth ? styles.emptyText : null,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('screen_calendar_festivals')}</Text>
            <Text style={styles.sectionHint}>{t('screen_calendar_observances')}</Text>
          </View>

          <View style={styles.festivalList}>
            {festivalItems.map(festival => (
              <View
                key={festival.title}
                style={[
                  styles.festivalCard,
                  festival.title === nextFestivalTitle ? styles.nextFestivalCard : null,
                ]}
              >
                <View style={styles.festivalTopRow}>
                  <Text style={styles.festivalTitle}>{festival.title}</Text>
                  {festival.title === nextFestivalTitle ? (
                    <View style={styles.nextFestivalBadge}>
                      <Text style={styles.nextFestivalBadgeText}>{t('screen_calendar_next')}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.festivalDate}>{festival.islamicDate}</Text>
                <Text style={styles.festivalEnglishDate}>{festival.englishDate}</Text>
                <Text style={styles.festivalDetails}>{festival.details}</Text>
              </View>
            ))}
          </View>
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
    bgOrbA: {
      position: 'absolute',
      top: -110,
      left: -60,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: colors.orbPrimary,
    },
    bgOrbB: {
      position: 'absolute',
      right: -60,
      top: 0,
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: colors.orbSecondary,
    },
    header: {
      paddingTop: 10,
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    backButton: {
      alignSelf: 'flex-start',
      backgroundColor: colors.surfaceStrong,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 7,
      marginBottom: 10,
    },
    backButtonText: {
      fontSize: 13,
      fontWeight: '800',
      color: colors.accent,
    },
    heroCard: {
      borderRadius: 18,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    kicker: {
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1,
      color: colors.accent,
      marginBottom: 4,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
    },
    subTitle: {
      marginTop: 4,
      fontSize: 13,
      lineHeight: 19,
      color: colors.textMuted,
    },
    subMeta: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: '700',
      color: colors.textSoft,
    },
    section: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      gap: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
    },
    sectionHint: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textSoft,
    },
    calendarCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
    },
    monthNavRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    monthNavButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accentSoft,
    },
    monthNavButtonText: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.accent,
    },
    monthTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
      flex: 1,
    },
    todayBanner: {
      backgroundColor: colors.accentSoft,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 12,
    },
    todayBannerLabel: {
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.8,
      color: colors.accent,
    },
    todayBannerValue: {
      marginTop: 4,
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
    },
    weekHeaderRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    weekHeaderText: {
      flex: 1,
      textAlign: 'center',
      fontSize: 12,
      fontWeight: '700',
      color: colors.textSoft,
    },
    dayCell: {
      width: `${100 / 7}%`,
      alignItems: 'center',
      marginBottom: 10,
    },
    dayBadge: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceMuted,
      borderWidth: 1,
      borderColor: colors.borderSoft,
    },
    todayBadge: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
      transform: [{ scale: 1.08 }],
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 3,
    },
    emptyBadge: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    dayText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
    },
    todayText: {
      color: colors.accentContrast,
    },
    emptyText: {
      color: 'transparent',
    },
    festivalList: {
      gap: 10,
    },
    festivalCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
    },
    nextFestivalCard: {
      borderColor: colors.accent,
      backgroundColor: colors.accentSoft,
    },
    festivalTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    },
    festivalTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },
    nextFestivalBadge: {
      backgroundColor: colors.accent,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    nextFestivalBadgeText: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.accentContrast,
    },
    festivalDate: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: '700',
      color: colors.accent,
    },
    festivalEnglishDate: {
      marginTop: 3,
      fontSize: 12,
      fontWeight: '700',
      color: colors.textSoft,
    },
    festivalDetails: {
      marginTop: 6,
      fontSize: 13,
      lineHeight: 20,
      color: colors.textMuted,
    },
  });

export default IslamicCalendar;
