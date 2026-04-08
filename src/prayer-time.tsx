import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Alert,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../App';
import {
  cancelPrayerNotifications,
  schedulePrayerNotificationsForPrayerNames,
} from './prayer-notifications';
import { getPrayerList, IST_TIME_ZONE, PRAYER_NAMES } from './prayer-utils';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';

type PrayerRow = {
  name: string;
  time: Date;
};

type NextPrayerInfo = {
  nextName: string;
  nextTime: Date;
  previousName: string;
  previousTime: Date;
};

function getNextPrayerInfo(now: Date): NextPrayerInfo {
  const todayList = getPrayerList(now);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayList = getPrayerList(yesterday);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowList = getPrayerList(tomorrow);

  for (let index = 0; index < todayList.length; index += 1) {
    if (now < todayList[index].time) {
      if (index === 0) {
        return {
          nextName: todayList[0].name,
          nextTime: todayList[0].time,
          previousName: yesterdayList[yesterdayList.length - 1].name,
          previousTime: yesterdayList[yesterdayList.length - 1].time,
        };
      }
      return {
        nextName: todayList[index].name,
        nextTime: todayList[index].time,
        previousName: todayList[index - 1].name,
        previousTime: todayList[index - 1].time,
      };
    }
  }

  return {
    nextName: tomorrowList[0].name,
    nextTime: tomorrowList[0].time,
    previousName: todayList[todayList.length - 1].name,
    previousTime: todayList[todayList.length - 1].time,
  };
}

function formatRemaining(ms: number): string {
  const safeMs = Math.max(ms, 0);
  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function PrayerTime() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const styles = createStyles(colors);
  const [now, setNow] = useState(() => new Date());
  const [dayOffset, setDayOffset] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);
  const [enabledPrayerAlerts, setEnabledPrayerAlerts] = useState<string[]>([
    ...PRAYER_NAMES,
  ]);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [t]);

  useEffect(() => {
    const setupDefaultPrayerAlerts = async () => {
      try {
        const scheduled = await schedulePrayerNotificationsForPrayerNames([
          ...PRAYER_NAMES,
        ]);

        if (!scheduled) {
          setNotificationStatus(t('screen_prayer_permission_text'));
          return;
        }

        setNotificationStatus('All 5 prayer alerts are on by default.');
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to enable default prayer alerts.';

        setNotificationStatus(message);
      }
    };

    setupDefaultPrayerAlerts();
  }, [t]);

  const selectedDate = useMemo(() => {
    const date = new Date(now);
    date.setDate(now.getDate() + dayOffset);
    return date;
  }, [now, dayOffset]);

  const selectedDateNow = useMemo(() => {
    const date = new Date(selectedDate);
    date.setHours(
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds(),
    );
    return date;
  }, [selectedDate, now]);

  const prayerRows = useMemo<PrayerRow[]>(() => getPrayerList(selectedDate), [selectedDate]);

  const nextPrayerInfo = useMemo(
    () => getNextPrayerInfo(selectedDateNow),
    [selectedDateNow],
  );
  const nextPrayerName = nextPrayerInfo.nextName;
  const nextPrayerTime = nextPrayerInfo.nextTime;
  const remainingMs = nextPrayerTime.getTime() - selectedDateNow.getTime();
  const totalRangeMs =
    nextPrayerInfo.nextTime.getTime() - nextPrayerInfo.previousTime.getTime();
  const elapsedMs = selectedDateNow.getTime() - nextPrayerInfo.previousTime.getTime();
  const targetProgress = Math.max(
    0,
    Math.min(1, totalRangeMs > 0 ? elapsedMs / totalRangeMs : 0),
  );

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: targetProgress,
      duration: 850,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [progressAnim, targetProgress]);

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: IST_TIME_ZONE,
      }).format(selectedDate),
    [selectedDate],
  );

  const animatedProgressWidth = useMemo(
    () =>
      progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, trackWidth],
      }),
    [progressAnim, trackWidth],
  );

  const formatTime = (time: Date) =>
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: IST_TIME_ZONE,
    }).format(time);

  const onTogglePrayerNotification = async (prayerName: string) => {
    try {
      const nextPrayerNames = enabledPrayerAlerts.includes(prayerName)
        ? enabledPrayerAlerts.filter(name => name !== prayerName)
        : [...enabledPrayerAlerts, prayerName];

      if (nextPrayerNames.length === 0) {
        await cancelPrayerNotifications();
        setEnabledPrayerAlerts([]);
        setNotificationStatus(t('screen_prayer_alerts_cleared'));
        return;
      }

      const scheduled = await schedulePrayerNotificationsForPrayerNames(nextPrayerNames);

      if (!scheduled) {
        Alert.alert(
          t('screen_prayer_permission_needed'),
          t('screen_prayer_permission_text'),
        );
        setNotificationStatus(t('screen_prayer_notifications_not_enabled'));
        return;
      }

      setEnabledPrayerAlerts(nextPrayerNames);
      setNotificationStatus(
        `${nextPrayerNames.join(', ')} alerts scheduled for the next 12 days.`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong while setting prayer alerts.';

      setNotificationStatus(message);
      Alert.alert(
        t('screen_prayer_unable_schedule'),
        message,
      );
    }
  };

  const onDisableNotifications = async () => {
    try {
      await cancelPrayerNotifications();
      setEnabledPrayerAlerts([]);
      setNotificationStatus('Prayer notifications have been cancelled.');
      Alert.alert(t('screen_prayer_disable_title'), t('screen_prayer_disable_text'));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong while removing prayer alerts.';

      setNotificationStatus(message);
      Alert.alert(
        t('screen_prayer_unable_cancel'),
        message,
      );
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.bgOrbA} />
      <View style={styles.bgOrbB} />
      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.kicker}>{t('screen_prayer_kicker')}</Text>
            <Text style={styles.title}>{t('screen_prayer_title')}</Text>
            <Text style={styles.subTitle}>{formattedDate} (IST)</Text>
          </View>
          <Pressable
            style={styles.settingsButton}
            onPress={() => navigation.navigate('PrayerSettings')}
          >
            <Icon name="settings-outline" size={22} color={colors.accent} />
          </Pressable>
        </View>

        <View style={styles.nextPrayerCard}>
          <View style={styles.nextPrayerHeader}>
            <Text style={styles.nextPrayerLabel}>{t('screen_prayer_next')}</Text>
            <View style={styles.statusChip}>
              <Text style={styles.statusChipText}>{t('screen_prayer_live')}</Text>
            </View>
          </View>
          <Text style={styles.nextPrayerName}>{nextPrayerName}</Text>
          <Text style={styles.nextPrayerTime}>{formatTime(nextPrayerTime)} IST</Text>
          <Text style={styles.countdownLabel}>
            {t('screen_prayer_time_remaining')}: {formatRemaining(remainingMs)}
          </Text>
          <View
            style={styles.progressTrack}
            onLayout={event => setTrackWidth(event.nativeEvent.layout.width)}
          >
            <Animated.View
              style={[styles.progressFill, { width: animatedProgressWidth }]}
            />
          </View>
          <Text style={styles.progressMeta}>
            {nextPrayerInfo.previousName} to {nextPrayerInfo.nextName}
          </Text>
        </View>

        <View style={styles.headerRow}>
          <Pressable
            style={styles.navButton}
            onPress={() => setDayOffset(value => value - 1)}
          >
            <Text style={styles.navIcon}>{'<'}</Text>
            <Text style={styles.navText}>{t('screen_prayer_previous_day')}</Text>
          </Pressable>

          <Pressable
            style={styles.navButton}
            onPress={() => setDayOffset(value => value + 1)}
          >
            <Text style={styles.navText}>{t('screen_prayer_next_day')}</Text>
            <Text style={styles.navIcon}>{'>'}</Text>
          </Pressable>
        </View>

        <View style={styles.listCard}>
          {notificationStatus ? (
            <View style={styles.listHeaderNote}>
              <Text style={styles.listHeaderNoteText}>{notificationStatus}</Text>
              {enabledPrayerAlerts.length > 0 ? (
                <Pressable onPress={onDisableNotifications}>
                  <Text style={styles.clearAllText}>{t('screen_prayer_clear_all')}</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
          {prayerRows.map(row => (
            <View
              key={row.name}
              style={[styles.row, row.name === nextPrayerName ? styles.nextRow : null]}
            >
              <View style={styles.prayerNameWrap}>
                <Text
                  style={[
                    styles.prayerName,
                    row.name === nextPrayerName ? styles.nextPrayerText : null,
                  ]}
                >
                  {row.name}
                </Text>
                {row.name === nextPrayerName ? (
                  <Text style={styles.nextTag}>{t('screen_prayer_next_badge')}</Text>
                ) : null}
              </View>
              <View style={styles.rowRight}>
                <Text
                  style={[
                    styles.prayerTime,
                    row.name === nextPrayerName ? styles.nextPrayerText : null,
                  ]}
                >
                  {formatTime(row.time)}
                </Text>
                <Pressable
                  style={[
                    styles.rowAlertButton,
                    enabledPrayerAlerts.includes(row.name)
                      ? styles.rowAlertButtonActive
                      : null,
                  ]}
                  onPress={() => onTogglePrayerNotification(row.name)}
                >
                  <Text
                    style={[
                      styles.rowAlertButtonText,
                      enabledPrayerAlerts.includes(row.name)
                        ? styles.rowAlertButtonTextActive
                        : null,
                    ]}
                  >
                    {enabledPrayerAlerts.includes(row.name)
                      ? t('screen_prayer_alert_on')
                      : t('screen_prayer_set_alert')}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
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
    pageContent: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 108, // Increased from 22 to 108 to account for bottom tab
    },
    bgOrbA: {
      position: 'absolute',
      top: -100,
      left: -50,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: colors.orbPrimary,
    },
    bgOrbB: {
      position: 'absolute',
      right: -70,
      top: 10,
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: colors.orbSecondary,
    },
    kicker: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1,
      color: colors.accent,
      marginBottom: 6,
    },
    topHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
    },
    title: {
      fontSize: 30,
      fontWeight: '800',
      color: colors.text,
    },
    subTitle: {
      fontSize: 14,
      color: colors.textMuted,
      fontWeight: '700',
      marginTop: 6,
      marginBottom: 14,
    },
    settingsButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: 4,
    },
    headerRow: {
      marginTop: 12,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    navButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    navIcon: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.accent,
    },
    navText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.accent,
    },
    nextPrayerCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 14,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 7 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
      elevation: 3,
    },
    nextPrayerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    nextPrayerLabel: {
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: colors.textSoft,
    },
    statusChip: {
      backgroundColor: colors.accentSoft,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 3,
    },
    statusChipText: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.accent,
    },
    nextPrayerName: {
      marginTop: 8,
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
    },
    nextPrayerTime: {
      marginTop: 4,
      fontSize: 17,
      fontWeight: '700',
      color: colors.accent,
    },
    countdownLabel: {
      marginTop: 10,
      fontSize: 15,
      color: colors.text,
      fontWeight: '600',
    },
    progressTrack: {
      marginTop: 10,
      height: 11,
      backgroundColor: colors.borderSoft,
      borderRadius: 999,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.accent,
      borderRadius: 999,
    },
    progressMeta: {
      marginTop: 8,
      fontSize: 12,
      color: colors.textMuted,
    },
    listCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 2,
    },
    listHeaderNote: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    listHeaderNoteText: {
      flex: 1,
      fontSize: 12,
      fontWeight: '700',
      color: colors.accent,
    },
    clearAllText: {
      fontSize: 12,
      fontWeight: '800',
      color: colors.text,
    },
    row: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: colors.borderSoft,
    },
    nextRow: {
      backgroundColor: colors.successSurface,
      borderLeftWidth: 4,
      borderLeftColor: colors.accent,
    },
    prayerNameWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    rowRight: {
      alignItems: 'flex-end',
      gap: 8,
    },
    prayerName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    prayerTime: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.accent,
    },
    rowAlertButton: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceMuted,
    },
    rowAlertButtonActive: {
      borderColor: colors.accent,
      backgroundColor: colors.accentSoft,
    },
    rowAlertButtonText: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.textMuted,
    },
    rowAlertButtonTextActive: {
      color: colors.accent,
    },
    nextTag: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.accent,
      backgroundColor: colors.accentSoft,
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    nextPrayerText: {
      color: colors.accentStrong,
      fontWeight: '800',
    },
  });

export default PrayerTime;
