import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../App';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';

type Dua = {
  id: number;
  title: string;
  arabic: string;
  english: string;
  translation: string;
};

const duas: Dua[] = [
  {
    id: 1,
    title: 'For Guidance',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    english: 'Rabbi zidni ilma',
    translation: 'My Lord, increase me in knowledge.',
  },
  {
    id: 2,
    title: 'For Good in This Life and the Hereafter',
    arabic:
      'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    english:
      'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar',
    translation:
      'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
  },
  {
    id: 3,
    title: 'For Forgiveness',
    arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
    english: 'Rabbighfir li wa tub alayya innaka antat-Tawwabur-Rahim',
    translation:
      'My Lord, forgive me and accept my repentance. Surely You are the Accepter of repentance, the Most Merciful.',
  },
  {
    id: 4,
    title: 'For Parents',
    arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    english: 'Rabbir hamhuma kama rabbayani saghira',
    translation: 'My Lord, have mercy upon them as they brought me up when I was small.',
  },
  {
    id: 5,
    title: 'Before Sleeping',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    english: 'Bismika Allahumma amutu wa ahya',
    translation: 'In Your name, O Allah, I die and I live.',
  },
  {
    id: 6,
    title: 'After Waking Up',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    english:
      'Alhamdu lillahil-ladhi ahyana bada ma amatana wa ilayhin-nushur',
    translation:
      'All praise is for Allah who gave us life after having caused us to die, and to Him is the resurrection.',
  },
  {
    id: 7,
    title: 'Entering the Home',
    arabic: 'بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى رَبِّنَا تَوَكَّلْنَا',
    english:
      'Bismillahi walajna wa bismillahi kharajna wa ala Rabbina tawakkalna',
    translation:
      'In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we place our trust.',
  },
  {
    id: 8,
    title: 'Leaving the Home',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    english:
      'Bismillahi tawakkaltu alallah wa la hawla wa la quwwata illa billah',
    translation:
      'In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.',
  },
  {
    id: 9,
    title: 'Entering the Masjid',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    english: 'Allahumma iftah li abwaba rahmatik',
    translation: 'O Allah, open for me the doors of Your mercy.',
  },
  {
    id: 10,
    title: 'Leaving the Masjid',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    english: 'Allahumma inni as aluka min fadlik',
    translation: 'O Allah, I ask You from Your bounty.',
  },
  {
    id: 11,
    title: 'Before Eating',
    arabic: 'بِسْمِ اللَّهِ',
    english: 'Bismillah',
    translation: 'In the name of Allah.',
  },
  {
    id: 12,
    title: 'After Eating',
    arabic:
      'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    english:
      'Alhamdu lillahil-ladhi atamani hadha wa razaqanihi min ghayri hawlin minni wa la quwwatin',
    translation:
      'All praise is for Allah who fed me this and provided it for me without any might or power from myself.',
  },
  {
    id: 13,
    title: 'For Anxiety and Worry',
    arabic:
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ',
    english:
      'Allahumma inni audhu bika minal-hammi wal-hazan wal-ajzi wal-kasal',
    translation:
      'O Allah, I seek refuge in You from anxiety, grief, helplessness, and laziness.',
  },
  {
    id: 14,
    title: 'For Patience',
    arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ',
    english: 'Rabbana afrigh alayna sabran wa tawaffana muslimin',
    translation:
      'Our Lord, pour upon us patience and let us die as Muslims in submission to You.',
  },
  {
    id: 15,
    title: 'Seeking Ease in Difficulty',
    arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    english:
      'Allahumma la sahla illa ma jaaltahu sahlan wa anta tajalul-hazna idha shita sahla',
    translation:
      'O Allah, there is no ease except in what You make easy, and You make hardship easy whenever You will.',
  },
];

function IslamicDua() {
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
          <Text style={styles.kicker}>{t('screen_dua_kicker')}</Text>
          <Text style={styles.title}>{t('screen_dua_title')}</Text>
          <Text style={styles.subTitle}>{t('screen_dua_subtitle')}</Text>
        </View>
      </View>

      <FlatList
        data={duas}
        keyExtractor={item => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.duaCard}>
            <View style={styles.rowTop}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{item.id}</Text>
              </View>
              <Text style={styles.duaTitle}>{item.title}</Text>
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
    duaCard: {
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
    duaTitle: {
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

export default IslamicDua;
