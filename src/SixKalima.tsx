import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../App';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';

type Kalima = {
  id: number;
  title: string;
  arabic: string;
  english: string;
  translation: string;
};

const kalimas: Kalima[] = [
  {
    id: 1,
    title: 'First Kalima - Tayyibah',
    arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ مُحَمَّدٌ رَسُولُ اللّٰهِ',
    english: 'La ilaha illallahu Muhammadur Rasulullah',
    translation: 'There is no god but Allah, and Muhammad is the Messenger of Allah.',
  },
  {
    id: 2,
    title: 'Second Kalima - Shahadat',
    arabic:
      'أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    english:
      'Ashhadu an la ilaha illallahu wahdahu la sharika lahu wa ashhadu anna Muhammadan abduhu wa rasuluhu',
    translation:
      'I bear witness that there is no god but Allah, He is One and has no partner, and I bear witness that Muhammad is His servant and Messenger.',
  },
  {
    id: 3,
    title: 'Third Kalima - Tamjid',
    arabic:
      'سُبْحَانَ اللّٰهِ وَالْحَمْدُ لِلّٰهِ وَلَا إِلٰهَ إِلَّا اللّٰهُ وَاللّٰهُ أَكْبَرُ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ الْعَلِيِّ الْعَظِيمِ',
    english:
      'Subhanallahi walhamdu lillahi wa la ilaha illallahu wallahu akbar wa la hawla wa la quwwata illa billahil aliyyil azim',
    translation:
      'Glory be to Allah, all praise is for Allah, there is no god but Allah, Allah is the Greatest, and there is no power nor strength except with Allah, the Most High, the Most Great.',
  },
  {
    id: 4,
    title: 'Fourth Kalima - Tawhid',
    arabic:
      'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ أَبَدًا أَبَدًا ذُو الْجَلَالِ وَالْإِكْرَامِ بِيَدِهِ الْخَيْرُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    english:
      'La ilaha illallahu wahdahu la sharika lahu lahul mulku wa lahul hamdu yuhyi wa yumitu wa huwa hayyun la yamutu abadan abada dhul jalali wal ikram biyadihil khayr wa huwa ala kulli shayin qadir',
    translation:
      'There is no god but Allah, He is One and has no partner. His is the kingdom and for Him is all praise. He gives life and causes death. He is living and never dies. He is the Lord of majesty and honour. In His hand is all good and He has power over everything.',
  },
  {
    id: 5,
    title: 'Fifth Kalima - Astaghfar',
    arabic:
      'أَسْتَغْفِرُ اللّٰهَ رَبِّي مِنْ كُلِّ ذَنْبٍ أَذْنَبْتُهُ عَمْدًا أَوْ خَطَأً سِرًّا أَوْ عَلَانِيَةً وَأَتُوبُ إِلَيْهِ مِنَ الذَّنْبِ الَّذِي أَعْلَمُ وَمِنَ الذَّنْبِ الَّذِي لَا أَعْلَمُ',
    english:
      'Astaghfirullaha rabbi min kulli dhanbin adhnabtuhu amdan aw khataan sirran aw alaniyatan wa atubu ilayhi min adh-dhanbilladhi alamu wa min adh-dhanbilladhi la alamu',
    translation:
      'I seek forgiveness from Allah, my Lord, from every sin I committed knowingly or unknowingly, secretly or openly, and I turn to Him in repentance from the sin that I know and from the sin that I do not know.',
  },
  {
    id: 6,
    title: 'Sixth Kalima - Radd-e-Kufr',
    arabic:
      'اللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ أَنْ أُشْرِكَ بِكَ شَيْئًا وَأَنَا أَعْلَمُ بِهِ وَأَسْتَغْفِرُكَ لِمَا لَا أَعْلَمُ بِهِ تُبْتُ عَنْهُ وَتَبَرَّأْتُ مِنَ الْكُفْرِ وَالشِّرْكِ وَالْكِذْبِ وَالْغِيبَةِ وَالْبِدْعَةِ وَالنَّمِيمَةِ وَالْفَوَاحِشِ وَالْبُهْتَانِ وَالْمَعَاصِي كُلِّهَا وَأَسْلَمْتُ وَأَقُولُ لَا إِلٰهَ إِلَّا اللّٰهُ مُحَمَّدٌ رَسُولُ اللّٰهِ',
    english:
      'Allahumma inni audhu bika min an ushrika bika shayan wa ana alamu bihi wa astaghfiruka lima la alamu bihi tubtu anhu wa tabarratu minal kufri wash-shirki wal-kidhbi wal-ghibati wal-bidati wan-namimati wal-fawahishi wal-buhtani wal-maasi kulliha wa aslamtu wa aqulu la ilaha illallahu Muhammadur Rasulullah',
    translation:
      'O Allah, I seek refuge in You from associating anything with You knowingly, and I seek Your forgiveness for what I do not know. I repent from it and reject disbelief, polytheism, falsehood, backbiting, innovation, tale-bearing, indecency, slander, and all sins. I submit and declare that there is no god but Allah and Muhammad is the Messenger of Allah.',
  },
];

function SixKalima() {
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
          <Text style={styles.kicker}>{t('screen_kalima_kicker')}</Text>
          <Text style={styles.title}>{t('screen_kalima_title')}</Text>
          <Text style={styles.subTitle}>{t('screen_kalima_subtitle')}</Text>
        </View>
      </View>

      <FlatList
        data={kalimas}
        keyExtractor={item => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.kalimaCard}>
            <View style={styles.rowTop}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{item.id}</Text>
              </View>
              <Text style={styles.kalimaTitle}>{item.title}</Text>
            </View>
            <Text style={styles.arabicText}>{item.arabic}</Text>
            <Text style={styles.label}>{t('common_english')}</Text>
            <Text style={styles.englishText}>{item.english}</Text>
            <Text style={styles.label}>{t('common_translation')}</Text>
            <Text style={styles.translationText}>{item.translation}</Text>
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
    kalimaCard: {
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
    rowTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    numberBadge: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    numberText: {
      fontSize: 12,
      fontWeight: '800',
      color: colors.accent,
    },
    kalimaTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },
    arabicText: {
      marginTop: 14,
      fontSize: 24,
      lineHeight: 38,
      textAlign: 'right',
      color: colors.text,
    },
    label: {
      marginTop: 12,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.8,
      color: colors.accent,
    },
    englishText: {
      marginTop: 4,
      fontSize: 14,
      lineHeight: 21,
      color: colors.text,
      fontStyle: 'italic',
    },
    translationText: {
      marginTop: 4,
      fontSize: 14,
      lineHeight: 21,
      color: colors.textMuted,
    },
  });

export default SixKalima;
