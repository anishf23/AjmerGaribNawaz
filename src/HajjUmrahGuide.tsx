import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../App';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';

type GuideTab = 'hajj' | 'umrah';

type GuideStep = {
  title: string;
  detail: string;
};

const hajjSteps: GuideStep[] = [
  {
    title: '1. Make intention and enter Ihram',
    detail:
      'Make niyyah for Hajj, wear Ihram, recite Talbiyah, and remain mindful of the restrictions of Ihram.',
  },
  {
    title: '2. Arrive in Makkah',
    detail:
      'If doing Tamattu or Qiran, enter Masjid al-Haram with humility and prepare for Tawaf.',
  },
  {
    title: '3. Perform Tawaf',
    detail:
      'Circle the Kaaba seven times in devotion, starting from the Black Stone if possible.',
  },
  {
    title: '4. Perform Sai',
    detail:
      'Walk seven times between Safa and Marwah remembering Hajar and trusting in Allah.',
  },
  {
    title: '5. Stay in Mina on 8 Dhul Hijjah',
    detail:
      'Travel to Mina, pray the daily prayers, and prepare spiritually for the day of Arafah.',
  },
  {
    title: '6. Stand at Arafah on 9 Dhul Hijjah',
    detail:
      'Spend the day in dua, repentance, and remembrance. This is the most important pillar of Hajj.',
  },
  {
    title: '7. Stay at Muzdalifah',
    detail:
      'After sunset travel to Muzdalifah, combine Maghrib and Isha, rest, and collect pebbles.',
  },
  {
    title: '8. Rami, sacrifice, and hair cutting',
    detail:
      'On 10 Dhul Hijjah throw pebbles at Jamarat al-Aqabah, perform sacrifice if required, and shave or trim the hair.',
  },
  {
    title: '9. Tawaf al-Ifadah',
    detail:
      'Return to Makkah to perform Tawaf al-Ifadah and Sai if still due.',
  },
  {
    title: '10. Stay in Mina and complete Rami',
    detail:
      'Spend the days of Tashriq in Mina and stone the three Jamarat each day.',
  },
  {
    title: '11. Farewell Tawaf',
    detail:
      'Before leaving Makkah, perform Tawaf al-Wada as the final act of devotion.',
  },
];

const umrahSteps: GuideStep[] = [
  {
    title: '1. Make intention and enter Ihram',
    detail:
      'Make niyyah for Umrah, wear Ihram, and begin reciting the Talbiyah on the way to Makkah.',
  },
  {
    title: '2. Enter Masjid al-Haram',
    detail:
      'Enter with humility, make dua, and head toward the Kaaba with gratitude.',
  },
  {
    title: '3. Perform Tawaf',
    detail:
      'Circle the Kaaba seven times starting from the Black Stone area if possible.',
  },
  {
    title: '4. Pray two rakah',
    detail:
      'If possible, pray two rakah after Tawaf, ideally near Maqam Ibrahim without causing difficulty to others.',
  },
  {
    title: '5. Perform Sai',
    detail:
      'Walk seven rounds between Safa and Marwah while making dua and remembering Allah.',
  },
  {
    title: '6. Shave or trim hair',
    detail:
      'Men should shave or trim, and women trim a small portion of hair. This completes the Umrah.',
  },
];

function HajjUmrahGuide() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const styles = createStyles(colors);
  const [activeTab, setActiveTab] = useState<GuideTab>('hajj');

  const guideSteps = activeTab === 'hajj' ? hajjSteps : umrahSteps;

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
            <Text style={styles.kicker}>{t('screen_hajj_kicker')}</Text>
            <Text style={styles.title}>{t('screen_hajj_title')}</Text>
            <Text style={styles.subTitle}>{t('screen_hajj_subtitle')}</Text>
          </View>
        </View>

        <View style={styles.tabWrap}>
          <Pressable
            style={[styles.tabButton, activeTab === 'hajj' ? styles.tabButtonActive : null]}
            onPress={() => setActiveTab('hajj')}
          >
            <Text
              style={[styles.tabText, activeTab === 'hajj' ? styles.tabTextActive : null]}
            >
              {t('screen_hajj_tab_hajj')}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'umrah' ? styles.tabButtonActive : null]}
            onPress={() => setActiveTab('umrah')}
          >
            <Text
              style={[styles.tabText, activeTab === 'umrah' ? styles.tabTextActive : null]}
            >
              {t('screen_hajj_tab_umrah')}
            </Text>
          </Pressable>
        </View>

        <View style={styles.stepsWrap}>
          {guideSteps.map((step, index) => (
            <View key={step.title} style={styles.stepCard}>
              <View style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepTitle}>{step.title}</Text>
              </View>
              <Text style={styles.stepDetail}>{step.detail}</Text>
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
    tabWrap: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 6,
      marginHorizontal: 16,
      marginBottom: 12,
      gap: 8,
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: colors.surfaceMuted,
    },
    tabButtonActive: {
      backgroundColor: colors.accent,
    },
    tabText: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.textMuted,
    },
    tabTextActive: {
      color: colors.accentContrast,
    },
    stepsWrap: {
      paddingHorizontal: 16,
      paddingBottom: 24,
      gap: 10,
    },
    stepCard: {
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
    stepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    stepBadge: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepBadgeText: {
      fontSize: 12,
      fontWeight: '800',
      color: colors.accent,
    },
    stepTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },
    stepDetail: {
      marginTop: 10,
      fontSize: 14,
      lineHeight: 22,
      color: colors.textMuted,
    },
  });

export default HajjUmrahGuide;
