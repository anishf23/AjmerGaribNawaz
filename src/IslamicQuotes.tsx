import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../App';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';

type IslamicQuote = {
  id: number;
  quote: string;
  source: string;
};

const islamicQuotes: IslamicQuote[] = [
  {
    id: 1,
    quote: 'Indeed, with hardship comes ease.',
    source: 'Quran 94:6',
  },
  {
    id: 2,
    quote: 'And He found you lost and guided you.',
    source: 'Quran 93:7',
  },
  {
    id: 3,
    quote: 'So remember Me; I will remember you.',
    source: 'Quran 2:152',
  },
  {
    id: 4,
    quote: 'Allah does not burden a soul beyond that it can bear.',
    source: 'Quran 2:286',
  },
  {
    id: 5,
    quote: 'The best among you are those who have the best manners and character.',
    source: 'Prophet Muhammad, Sahih al-Bukhari',
  },
  {
    id: 6,
    quote: 'Speak good or remain silent.',
    source: 'Prophet Muhammad, Sahih al-Bukhari and Muslim',
  },
  {
    id: 7,
    quote: 'The strong person is not the one who can wrestle, but the one who controls himself when angry.',
    source: 'Prophet Muhammad, Sahih al-Bukhari',
  },
  {
    id: 8,
    quote: 'Whoever puts his trust in Allah, He will be enough for him.',
    source: 'Quran 65:3',
  },
  {
    id: 9,
    quote: 'Do not despair of the mercy of Allah.',
    source: 'Quran 39:53',
  },
  {
    id: 10,
    quote: 'And your Lord says, Call upon Me; I will respond to you.',
    source: 'Quran 40:60',
  },
  {
    id: 11,
    quote: 'The most beloved deeds to Allah are those that are consistent, even if they are small.',
    source: 'Prophet Muhammad, Sahih al-Bukhari',
  },
  {
    id: 12,
    quote: 'Verily, in the remembrance of Allah do hearts find rest.',
    source: 'Quran 13:28',
  },
];

function IslamicQuotes() {
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
          <Text style={styles.kicker}>{t('screen_quotes_kicker')}</Text>
          <Text style={styles.title}>{t('screen_quotes_title')}</Text>
          <Text style={styles.subTitle}>{t('screen_quotes_subtitle')}</Text>
        </View>
      </View>

      <FlatList
        data={islamicQuotes}
        keyExtractor={item => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.quoteCard}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>{item.id}</Text>
            </View>
            <Text style={styles.quoteText}>{item.quote}</Text>
            <Text style={styles.sourceText}>{item.source}</Text>
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
    quoteCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
    },
    numberBadge: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    numberText: {
      fontSize: 12,
      fontWeight: '800',
      color: colors.accent,
    },
    quoteText: {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '700',
      color: colors.text,
    },
    sourceText: {
      marginTop: 12,
      fontSize: 13,
      lineHeight: 20,
      color: colors.textMuted,
      fontStyle: 'italic',
    },
  });

export default IslamicQuotes;
