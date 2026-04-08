import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../App';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';

const tasbihTargets = [33, 99, 100];

function TasbihCounter() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const styles = createStyles(colors);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.bgOrbA} />
      <View style={styles.bgOrbB} />
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t('common_back')}</Text>
        </Pressable>
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>{t('screen_tasbih_kicker')}</Text>
          <Text style={styles.title}>{t('screen_tasbih_title')}</Text>
          <Text style={styles.subTitle}>{t('screen_tasbih_subtitle')}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.targetRow}>
          {tasbihTargets.map(item => (
            <Pressable
              key={item}
              style={[styles.targetChip, target === item ? styles.targetChipActive : null]}
              onPress={() => {
                setTarget(item);
                setCount(0);
              }}
            >
              <Text
                style={[styles.targetChipText, target === item ? styles.targetChipTextActive : null]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={[styles.counterCircle, count >= target ? styles.counterCircleDone : null]}
          onPress={() => setCount(value => value + 1)}
        >
          <Text style={styles.counterValue}>{count}</Text>
          <Text style={styles.counterLabel}>{t('screen_tasbih_tap')}</Text>
        </Pressable>

        <Text style={styles.progressText}>
          {t('screen_tasbih_target')}: {target} | {t('screen_tasbih_remaining')}:{' '}
          {Math.max(target - count, 0)}
        </Text>

        <View style={styles.actionRow}>
          <Pressable style={styles.primaryButton} onPress={() => setCount(value => value + 1)}>
            <Text style={styles.primaryButtonText}>{t('screen_tasbih_add_one')}</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => setCount(0)}>
            <Text style={styles.secondaryButtonText}>{t('screen_tasbih_reset')}</Text>
          </Pressable>
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
      alignItems: 'center',
    },
    targetRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 18,
    },
    targetChip: {
      minWidth: 64,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    targetChipActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    targetChipText: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.text,
    },
    targetChipTextActive: {
      color: colors.accentContrast,
    },
    counterCircle: {
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: colors.surface,
      borderWidth: 3,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    counterCircleDone: {
      borderColor: colors.accent,
      backgroundColor: colors.accentSoft,
    },
    counterValue: {
      fontSize: 56,
      fontWeight: '800',
      color: colors.text,
    },
    counterLabel: {
      marginTop: 8,
      fontSize: 14,
      fontWeight: '700',
      color: colors.textMuted,
    },
    progressText: {
      marginTop: 18,
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
    },
    actionRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 18,
    },
    primaryButton: {
      minWidth: 120,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accent,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    primaryButtonText: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.accentContrast,
    },
    secondaryButton: {
      minWidth: 120,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    secondaryButtonText: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.text,
    },
  });

export default TasbihCounter;
