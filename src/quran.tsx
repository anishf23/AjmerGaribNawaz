import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';

type Ayah = {
  id: number;
  text: string;
  translation?: string;
};

type Surah = {
  id: number;
  name: string;
  transliteration: string;
  translation?: string;
  type: string;
  total_verses: number;
  verses: Ayah[];
};

const surahs = require('quran-json/dist/quran_en.json') as Surah[];

function Quran() {
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const styles = createStyles(colors);
  const [selectedSurahId, setSelectedSurahId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedSurah = useMemo(
    () => surahs.find(surah => surah.id === selectedSurahId) ?? null,
    [selectedSurahId],
  );

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredSurahs = useMemo(() => {
    if (!normalizedSearchQuery) {
      return surahs;
    }

    return surahs.filter(surah => {
      const haystacks = [
        String(surah.id),
        surah.name,
        surah.transliteration,
        surah.translation ?? '',
      ];

      return haystacks.some(value =>
        value.toLowerCase().includes(normalizedSearchQuery),
      );
    });
  }, [normalizedSearchQuery]);

  const renderSurahItem = ({ item }: ListRenderItemInfo<Surah>) => (
    <Pressable style={styles.surahCard} onPress={() => setSelectedSurahId(item.id)}>
      <View style={styles.surahNumberCircle}>
        <Text style={styles.surahNumberText}>{item.id}</Text>
      </View>
      <View style={styles.surahTextWrap}>
        <Text style={styles.surahTitle}>{item.transliteration}</Text>
        <Text style={styles.surahSubTitle}>
          {item.translation} • {item.total_verses} Ayat •{' '}
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </Text>
      </View>
      <Text style={styles.surahArabicName}>{item.name}</Text>
    </Pressable>
  );

  const renderAyahItem = ({ item }: ListRenderItemInfo<Ayah>) => (
    <View style={styles.ayahCard}>
      <Text style={styles.ayahNumber}>{item.id}</Text>
      <Text style={styles.ayahArabic}>{item.text}</Text>
      <Text style={styles.ayahTranslation}>{item.translation}</Text>
    </View>
  );

  if (selectedSurah) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <View style={styles.bgOrbA} />
        <View style={styles.bgOrbB} />
        <View style={styles.detailHeader}>
          <Pressable
            style={styles.backButton}
            onPress={() => setSelectedSurahId(null)}
          >
            <Text style={styles.backButtonText}>{t('common_back')}</Text>
          </Pressable>
          <View style={styles.detailHero}>
            <Text style={styles.detailKicker}>{t('screen_quran_detail_kicker')}</Text>
            <Text style={styles.detailTitle}>{selectedSurah.transliteration}</Text>
            <Text style={styles.detailSubTitle}>
              {selectedSurah.name} • {selectedSurah.translation}
            </Text>
          </View>
        </View>

        <FlatList
          data={selectedSurah.verses}
          keyExtractor={item => `${selectedSurah.id}-${item.id}`}
          renderItem={renderAyahItem}
          contentContainerStyle={styles.ayahListContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.bgOrbA} />
      <View style={styles.bgOrbB} />
      <View style={styles.listHero}>
        <Text style={styles.kicker}>BISMILLAH</Text>
        <Text style={styles.title}>{t('screen_quran_title')}</Text>
        <Text style={styles.subTitle}>{t('screen_quran_subtitle')}</Text>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('screen_quran_search_placeholder')}
          placeholderTextColor={colors.textSoft}
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filteredSurahs}
        keyExtractor={item => String(item.id)}
        renderItem={renderSurahItem}
        contentContainerStyle={styles.surahListContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              {t('screen_quran_search_empty_title')}
            </Text>
            <Text style={styles.emptyStateText}>
              {t('screen_quran_search_empty_text')}
            </Text>
          </View>
        }
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
      top: -90,
      left: -60,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: colors.orbPrimary,
    },
    bgOrbB: {
      position: 'absolute',
      right: -60,
      top: 20,
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: colors.orbSecondary,
    },
    listHero: {
      marginTop: 14,
      marginHorizontal: 16,
      marginBottom: 12,
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
    surahListContent: {
      paddingHorizontal: 16,
      paddingBottom: 96,
      gap: 9,
    },
    searchWrap: {
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    searchInput: {
      height: 48,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      color: colors.text,
      paddingHorizontal: 14,
      fontSize: 14,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 1,
    },
    surahCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
      elevation: 2,
    },
    surahNumberCircle: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    surahNumberText: {
      fontSize: 13,
      fontWeight: '800',
      color: colors.accent,
    },
    surahTextWrap: {
      flex: 1,
    },
    surahTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },
    surahSubTitle: {
      marginTop: 2,
      fontSize: 12,
      color: colors.textMuted,
    },
    surahArabicName: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginLeft: 8,
    },
    detailHeader: {
      paddingTop: 10,
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    detailHero: {
      borderRadius: 18,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    detailKicker: {
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1,
      color: colors.accent,
      marginBottom: 4,
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
    detailTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
    },
    detailSubTitle: {
      marginTop: 4,
      fontSize: 13,
      color: colors.textMuted,
    },
    ayahListContent: {
      paddingHorizontal: 16,
      paddingBottom: 96,
      gap: 10,
    },
    ayahCard: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
    },
    ayahNumber: {
      alignSelf: 'flex-start',
      fontSize: 11,
      fontWeight: '800',
      color: colors.accent,
      backgroundColor: colors.accentSoft,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      marginBottom: 10,
    },
    ayahArabic: {
      fontSize: 24,
      lineHeight: 38,
      textAlign: 'right',
      color: colors.text,
    },
    ayahTranslation: {
      marginTop: 10,
      fontSize: 14,
      lineHeight: 22,
      color: colors.textMuted,
    },
    emptyState: {
      marginTop: 36,
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    emptyStateTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
    },
    emptyStateText: {
      marginTop: 6,
      fontSize: 13,
      lineHeight: 20,
      color: colors.textMuted,
      textAlign: 'center',
    },
  });

export default Quran;
