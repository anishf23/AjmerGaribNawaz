import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../App';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';

const DEFAULT_LATITUDE = 19.076;
const DEFAULT_LONGITUDE = 72.8777;
const KAABA_LATITUDE = 21.4225;
const KAABA_LONGITUDE = 39.8262;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function toDegrees(value: number) {
  return (value * 180) / Math.PI;
}

function getQiblaBearing(latitude: number, longitude: number) {
  const lat1 = toRadians(latitude);
  const lon1 = toRadians(longitude);
  const lat2 = toRadians(KAABA_LATITUDE);
  const lon2 = toRadians(KAABA_LONGITUDE);
  const deltaLon = lon2 - lon1;

  const y = Math.sin(deltaLon);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(deltaLon);
  const bearing = (toDegrees(Math.atan2(y, x)) + 360) % 360;

  return Math.round(bearing);
}

function QiblaFinder() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const styles = createStyles(colors);

  const qiblaBearing = useMemo(
    () => getQiblaBearing(DEFAULT_LATITUDE, DEFAULT_LONGITUDE),
    [],
  );

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.bgOrbA} />
      <View style={styles.bgOrbB} />
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t('common_back')}</Text>
        </Pressable>
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>{t('screen_qibla_kicker')}</Text>
          <Text style={styles.title}>{t('screen_qibla_title')}</Text>
          <Text style={styles.subTitle}>{t('screen_qibla_subtitle')}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.compassCard}>
          <Text style={styles.compassLabel}>{t('screen_qibla_bearing')}</Text>
          <Text style={styles.compassValue}>{qiblaBearing}°</Text>
          <Text style={styles.compassHint}>{t('screen_qibla_hint')}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{t('screen_qibla_location')}</Text>
          <Text style={styles.infoText}>Mumbai, India</Text>
          <Text style={styles.infoMeta}>
            Latitude: {DEFAULT_LATITUDE} | Longitude: {DEFAULT_LONGITUDE}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{t('screen_qibla_how')}</Text>
          <Text style={styles.infoText}>
            {t('screen_qibla_how_text')} {qiblaBearing}°.
          </Text>
        </View>
      </View>
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
      gap: 12,
    },
    compassCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 20,
      alignItems: 'center',
    },
    compassLabel: {
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 1,
      color: colors.accent,
    },
    compassValue: {
      marginTop: 12,
      fontSize: 48,
      fontWeight: '800',
      color: colors.text,
    },
    compassHint: {
      marginTop: 8,
      fontSize: 13,
      textAlign: 'center',
      color: colors.textMuted,
    },
    infoCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 6,
    },
    infoText: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.text,
    },
    infoMeta: {
      marginTop: 6,
      fontSize: 12,
      color: colors.textMuted,
    },
  });

export default QiblaFinder;
