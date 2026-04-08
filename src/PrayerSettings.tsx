import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../App';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';

type PrayerOption = {
  label: string;
  value: string;
};

const madhabOptions: PrayerOption[] = [
  { label: 'Hanafi', value: 'hanafi' },
  { label: 'Shafi', value: 'shafi' },
];

const calculationOptions: PrayerOption[] = [
  { label: 'Muslim World League', value: 'mwl' },
  { label: 'Umm al-Qura', value: 'umm_al_qura' },
  { label: 'Egyptian', value: 'egyptian' },
  { label: 'Karachi', value: 'karachi' },
];

const highLatitudeOptions: PrayerOption[] = [
  { label: 'Middle of Night', value: 'middle_of_night' },
  { label: 'Seventh of Night', value: 'seventh' },
  { label: 'Twilight Angle', value: 'twilight' },
];

function PrayerSettings() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const styles = createStyles(colors);
  const [madhab, setMadhab] = useState('hanafi');
  const [calculationMethod, setCalculationMethod] = useState('mwl');
  const [highLatitudeRule, setHighLatitudeRule] = useState('middle_of_night');
  const [fajrAdjustment, setFajrAdjustment] = useState(0);
  const [ishaAdjustment, setIshaAdjustment] = useState(0);

  const renderOptionGroup = (
    title: string,
    options: PrayerOption[],
    selectedValue: string,
    onSelect: (value: string) => void,
  ) => (
    <View style={styles.groupCard}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.optionWrap}>
        {options.map(option => (
          <Pressable
            key={option.value}
            style={[
              styles.optionChip,
              selectedValue === option.value ? styles.optionChipActive : null,
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text
              style={[
                styles.optionChipText,
                selectedValue === option.value ? styles.optionChipTextActive : null,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderAdjustmentControl = (
    title: string,
    value: number,
    setValue: (value: number) => void,
  ) => (
    <View style={styles.groupCard}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.adjustRow}>
        <Pressable
          style={styles.adjustButton}
          onPress={() => setValue(Math.max(value - 1, -30))}
        >
          <Text style={styles.adjustButtonText}>-</Text>
        </Pressable>
        <Text style={styles.adjustValue}>{value} {t('screen_prayer_settings_min')}</Text>
        <Pressable
          style={styles.adjustButton}
          onPress={() => setValue(Math.min(value + 1, 30))}
        >
          <Text style={styles.adjustButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );

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
            <Text style={styles.kicker}>{t('screen_prayer_settings_kicker')}</Text>
            <Text style={styles.title}>{t('screen_prayer_settings_title')}</Text>
            <Text style={styles.subTitle}>{t('screen_prayer_settings_subtitle')}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {renderOptionGroup(t('screen_prayer_settings_madhab'), madhabOptions, madhab, setMadhab)}
          {renderOptionGroup(
            t('screen_prayer_settings_method'),
            calculationOptions,
            calculationMethod,
            setCalculationMethod,
          )}
          {renderOptionGroup(
            t('screen_prayer_settings_rule'),
            highLatitudeOptions,
            highLatitudeRule,
            setHighLatitudeRule,
          )}
          {renderAdjustmentControl(t('screen_prayer_settings_fajr'), fajrAdjustment, setFajrAdjustment)}
          {renderAdjustmentControl(t('screen_prayer_settings_isha'), ishaAdjustment, setIshaAdjustment)}

          <View style={styles.groupCard}>
            <Text style={styles.groupTitle}>{t('screen_prayer_settings_summary')}</Text>
            <View style={styles.summaryRow}>
              <Icon name="time-outline" size={18} color={colors.accent} />
              <Text style={styles.summaryText}>
                {t('screen_prayer_settings_madhab')}: {madhab === 'hanafi' ? 'Hanafi' : 'Shafi'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Icon name="options-outline" size={18} color={colors.accent} />
              <Text style={styles.summaryText}>
                {t('screen_prayer_settings_method_short')}: {
                  calculationOptions.find(option => option.value === calculationMethod)?.label
                }
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Icon name="moon-outline" size={18} color={colors.accent} />
              <Text style={styles.summaryText}>
                {t('screen_prayer_settings_rule_short')}: {
                  highLatitudeOptions.find(option => option.value === highLatitudeRule)?.label
                }
              </Text>
            </View>
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
    content: {
      paddingHorizontal: 16,
      paddingBottom: 24,
      gap: 12,
    },
    groupCard: {
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
    groupTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 10,
    },
    optionWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    optionChip: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: colors.surfaceMuted,
      borderWidth: 1,
      borderColor: colors.border,
    },
    optionChipActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    optionChipText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
    },
    optionChipTextActive: {
      color: colors.accentContrast,
    },
    adjustRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    adjustButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accentSoft,
    },
    adjustButtonText: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.accent,
    },
    adjustValue: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 8,
    },
    summaryText: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.textMuted,
      flex: 1,
    },
  });

export default PrayerSettings;
