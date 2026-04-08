import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../App';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';

type Hadith = {
  id: number;
  title: string;
  text: string;
  source: string;
};

const hadithList: Hadith[] = [
  {
    id: 1,
    title: 'Intention',
    text: 'Actions are judged by intentions, and every person will get the reward according to what he intended.',
    source: 'Sahih al-Bukhari, Sahih Muslim',
  },
  {
    id: 2,
    title: 'Good Character',
    text: 'The best among you are those who have the best manners and character.',
    source: 'Sahih al-Bukhari',
  },
  {
    id: 3,
    title: 'Mercy',
    text: 'Whoever does not show mercy will not be shown mercy.',
    source: 'Sahih al-Bukhari, Sahih Muslim',
  },
  {
    id: 4,
    title: 'Brotherhood',
    text: 'None of you truly believes until he loves for his brother what he loves for himself.',
    source: 'Sahih al-Bukhari, Sahih Muslim',
  },
  {
    id: 5,
    title: 'Speech',
    text: 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
    source: 'Sahih al-Bukhari, Sahih Muslim',
  },
  {
    id: 6,
    title: 'Cleanliness',
    text: 'Purity is half of faith.',
    source: 'Sahih Muslim',
  },
  {
    id: 7,
    title: 'Ease',
    text: 'Make things easy and do not make them difficult. Give glad tidings and do not drive people away.',
    source: 'Sahih al-Bukhari, Sahih Muslim',
  },
  {
    id: 8,
    title: 'Smiling',
    text: 'Your smile for your brother is charity.',
    source: 'Jami at-Tirmidhi',
  },
  {
    id: 9,
    title: 'Strength',
    text: 'The strong person is not the one who throws others down, but the one who controls himself when angry.',
    source: 'Sahih al-Bukhari',
  },
  {
    id: 10,
    title: 'Seeking Knowledge',
    text: 'Seeking knowledge is an obligation upon every Muslim.',
    source: 'Sunan Ibn Majah',
  },
  {
    id: 11,
    title: 'Trust in Allah',
    text: 'If you were to rely upon Allah with the reliance He is due, then He would provide for you as He provides for the birds.',
    source: 'Jami at-Tirmidhi',
  },
  {
    id: 12,
    title: 'Kindness',
    text: 'Allah is kind and loves kindness in all matters.',
    source: 'Sahih al-Bukhari, Sahih Muslim',
  },
];

function IslamicHadish() {
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
          <Text style={styles.kicker}>{t('screen_hadith_kicker')}</Text>
          <Text style={styles.title}>{t('screen_hadith_title')}</Text>
          <Text style={styles.subTitle}>{t('screen_hadith_subtitle')}</Text>
        </View>
      </View>

      <FlatList
        data={hadithList}
        keyExtractor={item => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.hadithCard}>
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>{item.id}</Text>
            </View>
            <Text style={styles.hadithTitle}>{item.title}</Text>
            <Text style={styles.hadithText}>{item.text}</Text>
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
    hadithCard: {
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
    hadithTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 8,
    },
    hadithText: {
      fontSize: 15,
      lineHeight: 24,
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

export default IslamicHadish;
