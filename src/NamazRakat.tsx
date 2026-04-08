import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../App';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';

type NamazRakatDetail = {
  title: string;
  fard: number;
  sunnah: number;
  nafl: number;
  witr?: number;
  total: number;
};

const namazRakatDetails: NamazRakatDetail[] = [
  {
    title: 'Fajr',
    fard: 2,
    sunnah: 2,
    nafl: 0,
    total: 4,
  },
  {
    title: 'Dhuhr',
    fard: 4,
    sunnah: 6,
    nafl: 2,
    total: 12,
  },
  {
    title: 'Asr',
    fard: 4,
    sunnah: 4,
    nafl: 0,
    total: 8,
  },
  {
    title: 'Maghrib',
    fard: 3,
    sunnah: 2,
    nafl: 2,
    total: 7,
  },
  {
    title: 'Isha',
    fard: 4,
    sunnah: 4,
    nafl: 4,
    witr: 3,
    total: 17,
  },
  {
    title: 'Jumu’ah',
    fard: 2,
    sunnah: 8,
    nafl: 4,
    total: 14,
  },
];

function NamazRakat() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const styles = createStyles(colors);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.bgOrbA} />
      <View style={styles.bgOrbB} />
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t('common_back')}</Text>
        </Pressable>
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>{t('namaz_kicker')}</Text>
          <Text style={styles.title}>{t('namaz_title')}</Text>
          <Text style={styles.subTitle}>{t('namaz_subtitle')}</Text>
        </View>
      </View>

      <FlatList
        data={namazRakatDetails}
        keyExtractor={item => item.title}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.prayerTitle}>{item.title}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('namaz_sunnah')}</Text>
              <Text style={styles.detailValue}>
                {item.title === 'Dhuhr' ? `${item.sunnah} (4 + 2)` : item.sunnah}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('namaz_fard')}</Text>
              <Text style={styles.detailValue}>{item.fard}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('namaz_nafl')}</Text>
              <Text style={styles.detailValue}>
                {item.title === 'Isha' ? `${item.nafl} (2 + 2)` : item.nafl}
              </Text>
            </View>
            {item.witr ? (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('namaz_witr')}</Text>
                <Text style={styles.detailValue}>{item.witr}</Text>
              </View>
            ) : null}
            <View style={[styles.detailRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>{t('namaz_total')}</Text>
              <Text style={styles.totalValue}>{item.total}</Text>
            </View>
          </View>
        )}
      />
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
    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 24,
      gap: 10,
    },
    card: {
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
    prayerTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 10,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderSoft,
    },
    detailLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textMuted,
    },
    detailValue: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },
    totalRow: {
      borderBottomWidth: 0,
      marginTop: 4,
    },
    totalLabel: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.accent,
    },
    totalValue: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.accent,
    },
  });

export default NamazRakat;
