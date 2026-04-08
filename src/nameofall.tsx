import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../App';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';

type AllahName = {
  id: number;
  arabic: string;
  english: string;
  translation: string;
};

const allahNames: AllahName[] = [
  { id: 1, arabic: 'الرَّحْمَن', english: 'Ar-Rahman', translation: 'The Most Compassionate' },
  { id: 2, arabic: 'الرَّحِيم', english: 'Ar-Rahim', translation: 'The Most Merciful' },
  { id: 3, arabic: 'الْمَلِك', english: 'Al-Malik', translation: 'The King' },
  { id: 4, arabic: 'الْقُدُّوس', english: 'Al-Quddus', translation: 'The Most Holy' },
  { id: 5, arabic: 'السَّلاَم', english: 'As-Salam', translation: 'The Source of Peace' },
  { id: 6, arabic: 'الْمُؤْمِن', english: 'Al-Mu’min', translation: 'The Guardian of Faith' },
  { id: 7, arabic: 'الْمُهَيْمِن', english: 'Al-Muhaymin', translation: 'The Protector' },
  { id: 8, arabic: 'الْعَزِيز', english: 'Al-Aziz', translation: 'The Almighty' },
  { id: 9, arabic: 'الْجَبَّار', english: 'Al-Jabbar', translation: 'The Compeller' },
  { id: 10, arabic: 'الْمُتَكَبِّر', english: 'Al-Mutakabbir', translation: 'The Supreme' },
  { id: 11, arabic: 'الْخَالِق', english: 'Al-Khaliq', translation: 'The Creator' },
  { id: 12, arabic: 'الْبَارِئ', english: 'Al-Bari', translation: 'The Originator' },
  { id: 13, arabic: 'الْمُصَوِّر', english: 'Al-Musawwir', translation: 'The Fashioner' },
  { id: 14, arabic: 'الْغَفَّار', english: 'Al-Ghaffar', translation: 'The Constant Forgiver' },
  { id: 15, arabic: 'الْقَهَّار', english: 'Al-Qahhar', translation: 'The All-Prevailing One' },
  { id: 16, arabic: 'الْوَهَّاب', english: 'Al-Wahhab', translation: 'The Supreme Bestower' },
  { id: 17, arabic: 'الرَّزَّاق', english: 'Ar-Razzaq', translation: 'The Provider' },
  { id: 18, arabic: 'الْفَتَّاح', english: 'Al-Fattah', translation: 'The Opener' },
  { id: 19, arabic: 'اَلْعَلِيْم', english: 'Al-Alim', translation: 'The All-Knowing' },
  { id: 20, arabic: 'الْقَابِض', english: 'Al-Qabid', translation: 'The Withholder' },
  { id: 21, arabic: 'الْبَاسِط', english: 'Al-Basit', translation: 'The Extender' },
  { id: 22, arabic: 'الْخَافِض', english: 'Al-Khafid', translation: 'The Reducer' },
  { id: 23, arabic: 'الرَّافِع', english: 'Ar-Rafi', translation: 'The Exalter' },
  { id: 24, arabic: 'الْمُعِزّ', english: 'Al-Muizz', translation: 'The Honourer' },
  { id: 25, arabic: 'المُذِلُّ', english: 'Al-Mudhill', translation: 'The Humiliator' },
  { id: 26, arabic: 'السَّمِيع', english: 'As-Sami', translation: 'The All-Hearing' },
  { id: 27, arabic: 'الْبَصِير', english: 'Al-Basir', translation: 'The All-Seeing' },
  { id: 28, arabic: 'الْحَكَم', english: 'Al-Hakam', translation: 'The Judge' },
  { id: 29, arabic: 'الْعَدْل', english: 'Al-Adl', translation: 'The Utterly Just' },
  { id: 30, arabic: 'اللَّطِيف', english: 'Al-Latif', translation: 'The Subtle One' },
  { id: 31, arabic: 'الْخَبِير', english: 'Al-Khabir', translation: 'The All-Aware' },
  { id: 32, arabic: 'الْحَلِيم', english: 'Al-Halim', translation: 'The Most Forbearing' },
  { id: 33, arabic: 'الْعَظِيم', english: 'Al-Azim', translation: 'The Magnificent' },
  { id: 34, arabic: 'الْغَفُور', english: 'Al-Ghafur', translation: 'The Great Forgiver' },
  { id: 35, arabic: 'الشَّكُور', english: 'Ash-Shakur', translation: 'The Most Appreciative' },
  { id: 36, arabic: 'الْعَلِي', english: 'Al-Ali', translation: 'The Most High' },
  { id: 37, arabic: 'الْكَبِير', english: 'Al-Kabir', translation: 'The Most Great' },
  { id: 38, arabic: 'الْحَفِيظ', english: 'Al-Hafiz', translation: 'The Preserver' },
  { id: 39, arabic: 'المُقيِت', english: 'Al-Muqit', translation: 'The Sustainer' },
  { id: 40, arabic: 'الْحسِيب', english: 'Al-Hasib', translation: 'The Reckoner' },
  { id: 41, arabic: 'الْجَلِيل', english: 'Al-Jalil', translation: 'The Majestic' },
  { id: 42, arabic: 'الْكَرِيم', english: 'Al-Karim', translation: 'The Most Generous' },
  { id: 43, arabic: 'الرَّقِيب', english: 'Ar-Raqib', translation: 'The Watchful' },
  { id: 44, arabic: 'الْمُجِيب', english: 'Al-Mujib', translation: 'The Responsive One' },
  { id: 45, arabic: 'الْوَاسِع', english: 'Al-Wasi', translation: 'The All-Encompassing' },
  { id: 46, arabic: 'الْحَكِيم', english: 'Al-Hakim', translation: 'The All-Wise' },
  { id: 47, arabic: 'الْوَدُود', english: 'Al-Wadud', translation: 'The Most Loving' },
  { id: 48, arabic: 'الْمَجِيد', english: 'Al-Majid', translation: 'The Glorious' },
  { id: 49, arabic: 'الْبَاعِث', english: 'Al-Baith', translation: 'The Resurrector' },
  { id: 50, arabic: 'الشَّهِيد', english: 'Ash-Shahid', translation: 'The All Witnessing' },
  { id: 51, arabic: 'الْحَق', english: 'Al-Haqq', translation: 'The Absolute Truth' },
  { id: 52, arabic: 'الْوَكِيل', english: 'Al-Wakil', translation: 'The Trustee' },
  { id: 53, arabic: 'الْقَوِي', english: 'Al-Qawiyy', translation: 'The All-Strong' },
  { id: 54, arabic: 'الْمَتِين', english: 'Al-Matin', translation: 'The Firm One' },
  { id: 55, arabic: 'الْوَلِي', english: 'Al-Waliyy', translation: 'The Protecting Friend' },
  { id: 56, arabic: 'الْحَمِيد', english: 'Al-Hamid', translation: 'The Praiseworthy' },
  { id: 57, arabic: 'الْمُحْصِي', english: 'Al-Muhsi', translation: 'The All-Enumerating' },
  { id: 58, arabic: 'الْمُبْدِئ', english: 'Al-Mubdi', translation: 'The Originator' },
  { id: 59, arabic: 'الْمُعِيد', english: 'Al-Muid', translation: 'The Restorer' },
  { id: 60, arabic: 'الْمُحْيِي', english: 'Al-Muhyi', translation: 'The Giver of Life' },
  { id: 61, arabic: 'اَلْمُمِيت', english: 'Al-Mumit', translation: 'The Creator of Death' },
  { id: 62, arabic: 'الْحَي', english: 'Al-Hayy', translation: 'The Ever-Living' },
  { id: 63, arabic: 'الْقَيُّوم', english: 'Al-Qayyum', translation: 'The Sustainer' },
  { id: 64, arabic: 'الْوَاجِد', english: 'Al-Wajid', translation: 'The Perceiver' },
  { id: 65, arabic: 'الْمَاجِد', english: 'Al-Majid', translation: 'The Noble' },
  { id: 66, arabic: 'الْواحِد', english: 'Al-Wahid', translation: 'The One' },
  { id: 67, arabic: 'اَلاَحَد', english: 'Al-Ahad', translation: 'The Unique One' },
  { id: 68, arabic: 'الصَّمَد', english: 'As-Samad', translation: 'The Eternal Refuge' },
  { id: 69, arabic: 'الْقَادِر', english: 'Al-Qadir', translation: 'The Omnipotent' },
  { id: 70, arabic: 'الْمُقْتَدِر', english: 'Al-Muqtadir', translation: 'The All Powerful' },
  { id: 71, arabic: 'الْمُقَدِّم', english: 'Al-Muqaddim', translation: 'The Expediter' },
  { id: 72, arabic: 'الْمُؤَخِّر', english: 'Al-Muakhkhir', translation: 'The Delayer' },
  { id: 73, arabic: 'الأوَّل', english: 'Al-Awwal', translation: 'The First' },
  { id: 74, arabic: 'الآخِر', english: 'Al-Akhir', translation: 'The Last' },
  { id: 75, arabic: 'الظَّاهِر', english: 'Az-Zahir', translation: 'The Manifest' },
  { id: 76, arabic: 'الْبَاطِن', english: 'Al-Batin', translation: 'The Hidden One' },
  { id: 77, arabic: 'الْوَالِي', english: 'Al-Wali', translation: 'The Sole Governor' },
  { id: 78, arabic: 'الْمُتَعَالِي', english: 'Al-Mutaali', translation: 'The Self Exalted' },
  { id: 79, arabic: 'الْبَر', english: 'Al-Barr', translation: 'The Source of Goodness' },
  { id: 80, arabic: 'التَّوَاب', english: 'At-Tawwab', translation: 'The Ever-Pardoning' },
  { id: 81, arabic: 'الْمُنْتَقِم', english: 'Al-Muntaqim', translation: 'The Avenger' },
  { id: 82, arabic: 'العَفُو', english: 'Al-Afuww', translation: 'The Pardoner' },
  { id: 83, arabic: 'الرَّؤُوف', english: 'Ar-Ra’uf', translation: 'The Most Kind' },
  { id: 84, arabic: 'مَالِكُ الْمُلْك', english: 'Malik-ul-Mulk', translation: 'Master of the Kingdom' },
  { id: 85, arabic: 'ذُوالْجَلاَلِ وَالإكْرَام', english: 'Dhul-Jalali Wal-Ikram', translation: 'Lord of Glory and Honour' },
  { id: 86, arabic: 'الْمُقْسِط', english: 'Al-Muqsit', translation: 'The Equitable One' },
  { id: 87, arabic: 'الْجَامِع', english: 'Al-Jami', translation: 'The Gatherer' },
  { id: 88, arabic: 'الْغَنِي', english: 'Al-Ghani', translation: 'The Self-Sufficient' },
  { id: 89, arabic: 'الْمُغْنِي', english: 'Al-Mughni', translation: 'The Enricher' },
  { id: 90, arabic: 'اَلْمَانِع', english: 'Al-Mani', translation: 'The Preventer' },
  { id: 91, arabic: 'الضَّار', english: 'Ad-Darr', translation: 'The Distresser' },
  { id: 92, arabic: 'النَّافِع', english: 'An-Nafi', translation: 'The Propitious' },
  { id: 93, arabic: 'النُّور', english: 'An-Nur', translation: 'The Light' },
  { id: 94, arabic: 'الْهَادِي', english: 'Al-Hadi', translation: 'The Guide' },
  { id: 95, arabic: 'الْبَدِيع', english: 'Al-Badi', translation: 'The Incomparable Originator' },
  { id: 96, arabic: 'الْبَاقِي', english: 'Al-Baqi', translation: 'The Everlasting' },
  { id: 97, arabic: 'الْوَارِث', english: 'Al-Warith', translation: 'The Inheritor' },
  { id: 98, arabic: 'الرَّشِيد', english: 'Ar-Rashid', translation: 'The Guide to the Right Path' },
  { id: 99, arabic: 'الصَّبُور', english: 'As-Sabur', translation: 'The Most Patient' },
];

function NameOfAllah() {
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
          <Text style={styles.kicker}>{t('screen_allah_kicker')}</Text>
          <Text style={styles.title}>{t('screen_allah_title')}</Text>
          <Text style={styles.subTitle}>{t('screen_allah_subtitle')}</Text>
        </View>
      </View>

      <FlatList
        data={allahNames}
        keyExtractor={item => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.nameCard}>
            <View style={styles.rowTop}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{item.id}</Text>
              </View>
              <Text style={styles.englishName}>{item.english}</Text>
              <Text style={styles.arabicName}>{item.arabic}</Text>
            </View>
            <Text style={styles.translationLabel}>{t('common_translation')}</Text>
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
    nameCard: {
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
      justifyContent: 'space-between',
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
    englishName: {
      flex: 1,
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },
    arabicName: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'right',
    },
    translationLabel: {
      marginTop: 12,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.8,
      color: colors.accent,
    },
    translationText: {
      marginTop: 4,
      fontSize: 14,
      lineHeight: 20,
      color: colors.textMuted,
    },
  });

export default NameOfAllah;
