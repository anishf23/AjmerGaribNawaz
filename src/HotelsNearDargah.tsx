import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../App';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';

type Hotel = {
  name: string;
  distance: string;
  kmFromDargah: string;
  detail: string;
};

const hotels: Hotel[] = [
  {
    name: 'Hotel Ata-E-Khuda',
    distance: 'Near Ajmer Dargah',
    kmFromDargah: '0.3 km from Ajmer Dargah',
    detail:
      'A commonly preferred stay option for pilgrims looking for easy walking access to Ajmer Sharif Dargah.',
  },
  {
    name: 'Hotel Moon Star',
    distance: 'A short distance from the dargah',
    kmFromDargah: '0.5 km from Ajmer Dargah',
    detail:
      'Suitable for visitors who want a simple stay close to the main ziyarat area and local market streets.',
  },
  {
    name: 'Hotel Merwara Estate',
    distance: 'Ajmer city area',
    kmFromDargah: '2.4 km from Ajmer Dargah',
    detail:
      'A more spacious hotel option for families visiting Ajmer and nearby religious places.',
  },
  {
    name: 'Hotel Plaza Inn',
    distance: 'Near railway station and shrine route',
    kmFromDargah: '1.3 km from Ajmer Dargah',
    detail:
      'Useful for travelers who want convenient transport access along with a short ride to the dargah.',
  },
  {
    name: 'Hotel Ajmer Regency',
    distance: 'Central Ajmer',
    kmFromDargah: '1.8 km from Ajmer Dargah',
    detail:
      'A city stay option that offers convenient access to both Ajmer Sharif and surrounding attractions.',
  },
  {
    name: 'Hotel Chishti Palace',
    distance: 'Close to Ajmer Sharif area',
    kmFromDargah: '0.4 km from Ajmer Dargah',
    detail:
      'A pilgrim-focused option named around the Chishti heritage and often chosen for shrine visits.',
  },
  {
    name: 'Hotel Royal Melange Beacon',
    distance: 'A few minutes from shrine area',
    kmFromDargah: '2.1 km from Ajmer Dargah',
    detail:
      'A more premium stay choice for visitors who want extra comfort while remaining close to Ajmer landmarks.',
  },
];

function HotelsNearDargah() {
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
          <Text style={styles.kicker}>{t('screen_hotels_kicker')}</Text>
          <Text style={styles.title}>{t('screen_hotels_title')}</Text>
          <Text style={styles.subTitle}>{t('screen_hotels_subtitle')}</Text>
        </View>
      </View>

      <FlatList
        data={hotels}
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
                <Text style={styles.hotelTitle}>{item.name}</Text>
                <Text style={styles.hotelDistance}>{item.distance}</Text>
                <Text style={styles.hotelKm}>{item.kmFromDargah}</Text>
              </View>
            </View>
            <Text style={styles.hotelDetail}>{item.detail}</Text>
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
    hotelTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.text,
    },
    hotelDistance: {
      marginTop: 2,
      fontSize: 12,
      color: colors.textMuted,
    },
    hotelKm: {
      marginTop: 2,
      fontSize: 12,
      fontWeight: '700',
      color: colors.accent,
    },
    hotelDetail: {
      fontSize: 13,
      lineHeight: 20,
      color: colors.textMuted,
    },
  });

export default HotelsNearDargah;
