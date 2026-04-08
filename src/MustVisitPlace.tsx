import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../App';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';

type Place = {
  name: string;
  subtitle: string;
  detail: string;
};

const places: Place[] = [
  {
    name: 'Ajmer Sharif Dargah',
    subtitle: 'Hazrat Khwaja Moinuddin Chishti',
    detail:
      'The most important spiritual destination in Ajmer and the main ziyarat place for devotees visiting the city.',
  },
  {
    name: 'Nizam Gate',
    subtitle: 'Main entrance to the dargah area',
    detail:
      'A famous gateway near Ajmer Sharif where many visitors begin their visit before entering the shrine complex.',
  },
  {
    name: 'Buland Darwaza',
    subtitle: 'Historic ceremonial gate',
    detail:
      'A well-known monument inside the shrine surroundings, especially significant during Urs and special religious gatherings.',
  },
  {
    name: 'Mehfil Khana',
    subtitle: 'Qawwali and spiritual gatherings',
    detail:
      'A place associated with devotional gatherings where visitors often experience the spiritual atmosphere of Ajmer Sharif.',
  },
  {
    name: 'Ana Sagar Lake',
    subtitle: 'Scenic place in Ajmer',
    detail:
      'A peaceful lake for families and travelers visiting Ajmer, offering a calm stop alongside the religious sites.',
  },
  {
    name: 'Adhai Din Ka Jhonpra',
    subtitle: 'Historic Islamic monument',
    detail:
      'A notable heritage site in Ajmer known for its early Indo-Islamic architecture and historical significance.',
  },
  {
    name: 'Taragarh Fort',
    subtitle: 'Historic fort with panoramic views',
    detail:
      'A hilltop fort overlooking Ajmer, suitable for visitors who want both history and wide views of the city.',
  },
  {
    name: 'Akbari Fort & Museum',
    subtitle: 'Mughal-era fort and museum',
    detail:
      'A historical place connected with Ajmer’s Mughal past, featuring exhibits and local history.',
  },
];

function MustVisitPlace() {
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
          <Text style={styles.kicker}>{t('screen_places_kicker')}</Text>
          <Text style={styles.title}>{t('screen_places_title')}</Text>
          <Text style={styles.subTitle}>{t('screen_places_subtitle')}</Text>
        </View>
      </View>

      <FlatList
        data={places}
        keyExtractor={item => item.name}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={styles.cardTopRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{index + 1}</Text>
              </View>
              <View style={styles.textWrap}>
                <Text style={styles.placeTitle}>{item.name}</Text>
                <Text style={styles.placeSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Text style={styles.placeDetail}>{item.detail}</Text>
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
      top: 10,
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
    cardTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    badge: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    badgeText: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.accent,
    },
    textWrap: {
      flex: 1,
    },
    placeTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.text,
    },
    placeSubtitle: {
      marginTop: 2,
      fontSize: 12,
      color: colors.textMuted,
    },
    placeDetail: {
      fontSize: 13,
      lineHeight: 20,
      color: colors.textMuted,
    },
  });

export default MustVisitPlace;
