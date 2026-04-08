import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';
import { getPrayerList } from './prayer-utils';
import { PRAYER_NAMES } from './prayer-utils';

const PRAYER_TRACKER_INDEX_KEY = 'PRAYER_TRACKER_INDEX';

type PrayerTrackerRecord = {
  date: string;
  done: Record<string, boolean>;
};

function PrayerTracker() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const styles = createStyles(colors);
  const [records, setRecords] = useState<PrayerTrackerRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateSearch, setDateSearch] = useState('');
  const [showAllDates, setShowAllDates] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const loadRecords = useCallback(async () => {
    try {
      const indexRaw = await AsyncStorage.getItem(PRAYER_TRACKER_INDEX_KEY);
      if (!indexRaw) {
        setRecords([]);
        return;
      }

      const keys: string[] = JSON.parse(indexRaw);
      const entries = await Promise.all(
        keys.map(async key => {
          const raw = await AsyncStorage.getItem(key);
          if (!raw) return null;
          const done = JSON.parse(raw) as Record<string, boolean>;
          const date = key.replace('PRAYER_TRACKER_', '');
          return { date, done };
        }),
      );

      const valid = entries.filter((entry): entry is PrayerTrackerRecord => entry !== null);
      valid.sort((a, b) => (a.date < b.date ? 1 : -1));
      setRecords(valid);
    } catch (error) {
      console.warn('Unable to load prayer tracker history', error);
      setRecords([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [loadRecords]),
  );

  const stats = React.useMemo(() => {
    const dailyCounts = PRAYER_NAMES.reduce((acc, prayerName) => ({
      ...acc,
      [prayerName]: 0,
    }), {} as Record<string, number>);
    let totalDone = 0;

    records.forEach(record => {
      PRAYER_NAMES.forEach(prayerName => {
        if (record.done[prayerName]) {
          totalDone += 1;
          dailyCounts[prayerName] += 1;
        }
      });
    });

    const days = records.length;
    const expected = days * PRAYER_NAMES.length;
    const averagePerDay = days > 0 ? totalDone / days : 0;
    const overallCompletion = expected > 0 ? (totalDone / expected) * 100 : 0;

    return {
      days,
      totalDone,
      expected,
      averagePerDay,
      overallCompletion,
      dailyCounts,
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    if (!selectedDate) return records;
    return records.filter(record => record.date === selectedDate);
  }, [records, selectedDate]);

  const formattedSelectedDate = selectedDate || 'Not selected';

  const availableDates = useMemo(() => {
    const setDates = new Set<string>();
    records.forEach(record => setDates.add(record.date));
    return Array.from(setDates).sort((a, b) => (a < b ? 1 : -1));
  }, [records]);

  const filteredAvailableDates = useMemo(() => {
    let list = availableDates;
    if (dateSearch) {
      list = list.filter(d => d.includes(dateSearch));
    }
    if (!showAllDates) {
      return list.slice(0, 30);
    }
    return list;
  }, [availableDates, dateSearch, showAllDates]);

  const renderItem = ({ item }: { item: PrayerTrackerRecord }) => {
    const recordDate = new Date(item.date);
    const today = new Date();
    const prayers = getPrayerList(recordDate);

    const prayerStatus = prayers.map(prayer => {
      const done = !!item.done[prayer.name];
      const isPast = today.getTime() > prayer.time.getTime();
      let statusText = 'Pending';
      let color = colors.textMuted;

      if (done) {
        statusText = 'Done';
        color = colors.accent;
      } else if (today.getTime() >= recordDate.getTime() && isPast) {
        statusText = 'Miss';
        color = colors.accentStrong;
      }

      return (
        <Text key={prayer.name} style={[styles.prayerText, { color }]}> 
          {prayer.name}: {statusText}  
        </Text>
      );
    });

    const total = Object.keys(item.done).length;
    const completed = Object.values(item.done).filter(v => v).length;
    const completionPercent = total > 0 ? (completed / total) * 100 : 0;

    return (
      <View style={styles.recordCard}>
        <Text style={styles.recordDate}>{item.date}</Text>
        <View style={styles.progressWrap}>
          <View style={[styles.progressBar, { width: `${completionPercent}%` }]} />
        </View>
        <Text style={styles.progressText}>{`${completed} of ${total} prayers completed`}</Text>
        {prayerStatus}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Prayer Tracker History</Text>
        <Text style={styles.headerAction} onPress={() => navigation.goBack()}>
          Close
        </Text>
      </View>

      {records.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No tracker records yet. Mark prayer done from Home to save.</Text>
        </View>
      ) : (
        <>
          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Days Tracked</Text>
              <Text style={styles.statValue}>{stats.days}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Done</Text>
              <Text style={styles.statValue}>{stats.totalDone}/{stats.expected}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Avg / Day</Text>
              <Text style={styles.statValue}>{stats.averagePerDay.toFixed(1)}</Text>
            </View>
          </View>
          <View style={styles.dailyCountRow}>
            {PRAYER_NAMES.map(prayerName => (
              <View key={prayerName} style={styles.dailyCountChip}>
                <Text style={styles.dailyCountName}>{prayerName}</Text>
                <Text style={styles.dailyCountValue}>{stats.dailyCounts[prayerName]}</Text>
              </View>
            ))}
          </View>
          <View style={styles.dateFilterRow}>
            <TouchableOpacity style={styles.dateFilterButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateFilterButtonText}>Select Date</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateClearButton} onPress={() => setSelectedDate('')}>
              <Text style={styles.dateClearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.selectedDateText}>Selected: {formattedSelectedDate}</Text>
          {showDatePicker ? (
            <View style={styles.datePickerWrapper}>
              <View style={styles.datePickerControls}>
              <TextInput
                style={styles.dateFilterInput}
                value={dateSearch}
                onChangeText={setDateSearch}
                placeholder="Search dates"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.toggleDatesButton}
                onPress={() => setShowAllDates(prev => !prev)}
              >
                <Text style={styles.toggleDatesButtonText}>
                  {showAllDates ? 'Show first 30' : `Show all (${availableDates.length})`}
                </Text>
              </TouchableOpacity>
              </View>
              <View style={styles.datePickerList}>
              {filteredAvailableDates.map(dateValue => (
                <TouchableOpacity
                  key={dateValue}
                  style={styles.dateOption}
                  onPress={() => {
                    setSelectedDate(dateValue);
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={styles.dateOptionText}>{dateValue}</Text>
                </TouchableOpacity>
              ))}
              </View>
            </View>
          ) : null}
        <FlatList
            data={filteredRecords}
          keyExtractor={item => item.date}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        </>
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    headerAction: {
      fontSize: 15,
      color: colors.accent,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    emptyText: {
      color: colors.textMuted,
      fontSize: 16,
    },
    listContent: {
      paddingBottom: 100,
    },
    recordCard: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      padding: 12,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    recordDate: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    prayerText: {
      fontSize: 14,
      marginBottom: 4,
    },
    progressWrap: {
      width: '100%',
      height: 10,
      backgroundColor: colors.surfaceMuted,
      borderRadius: 6,
      overflow: 'hidden',
      marginVertical: 8,
    },
    progressBar: {
      height: '100%',
      backgroundColor: colors.accent,
      borderRadius: 6,
    },
    progressText: {
      color: colors.textMuted,
      fontSize: 12,
      marginBottom: 8,
    },
    statsSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 10,
      marginRight: 8,
      minWidth: 95,
    },
    statLabel: {
      fontSize: 11,
      color: colors.textMuted,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    dailyCountRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    dailyCountChip: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingVertical: 8,
      paddingHorizontal: 6,
      alignItems: 'center',
      minWidth: 60,
    },
    dailyCountName: {
      fontSize: 10,
      color: colors.textMuted,
      marginBottom: 2,
    },
    dailyCountValue: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.text,
    },
    dateFilterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
      gap: 8,
    },
    dateFilterButton: {
      flex: 1,
      backgroundColor: colors.accent,
      borderRadius: 10,
      paddingVertical: 8,
      alignItems: 'center',
      marginRight: 6,
    },
    dateFilterButtonText: {
      color: colors.accentContrast,
      fontWeight: '700',
    },
    dateClearButton: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingVertical: 8,
      alignItems: 'center',
      marginLeft: 6,
    },
    dateClearButtonText: {
      color: colors.text,
      fontWeight: '700',
    },
    selectedDateText: {
      color: colors.textMuted,
      fontSize: 12,
      marginBottom: 8,
    },
    datePickerWrapper: {
      marginBottom: 12,
    },
    datePickerControls: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 8,
    },
    dateFilterInput: {
      flex: 1,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 6,
      color: colors.text,
      backgroundColor: colors.surface,
    },
    toggleDatesButton: {
      backgroundColor: colors.accentSoft,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 10,
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    toggleDatesButtonText: {
      color: colors.accent,
      fontWeight: '700',
      fontSize: 12,
    },
    datePickerList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
      gap: 8,
    },
    dateOption: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingVertical: 6,
      paddingHorizontal: 8,
      marginBottom: 4,
    },
    dateOptionText: {
      color: colors.text,
      fontSize: 12,
    },
    dateInput: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
      color: colors.text,
      fontSize: 12,
    },
  });

export default PrayerTracker;
