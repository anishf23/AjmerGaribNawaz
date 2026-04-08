import React, { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import type { RootStackParamList } from '../App';
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

type QuranpediaGroupedResults = {
  items?: QuranpediaSearchItem[];
  total?: number;
};

type QuranpediaSearchItem = {
  highlighted_text?: string;
  book_info?: {
    id: number;
    name: string;
    category?: string;
    author?: string;
  };
  topic?: {
    id: number;
    name: string;
  };
  fatwa?: {
    id: number;
    ar_title?: string;
    question_summary?: string;
    author?: string;
  };
  note?: string;
};

type QuranpediaSearchResponse = {
  books?: QuranpediaGroupedResults;
  topics?: QuranpediaGroupedResults;
  fatwas?: QuranpediaGroupedResults;
  notes?: QuranpediaGroupedResults;
};

type ReferenceCard = {
  id: string;
  title: string;
  body: string;
  meta: string;
};

type AnswerState = {
  summary: string;
  quranMatches: ReferenceCard[];
  apiMatches: ReferenceCard[];
};

const surahs = require('quran-json/dist/quran_en.json') as Surah[];

const QUICK_PROMPTS = [
  'What does the Quran say about patience?',
  'Tell me about mercy in Islam',
  'Verses about gratitude',
  'Advice for anger in Islam',
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function scoreTextMatch(queryTerms: string[], text: string) {
  const haystack = normalize(text);

  return queryTerms.reduce((score, term) => {
    if (!term) {
      return score;
    }

    if (haystack.includes(term)) {
      return score + Math.max(2, term.length);
    }

    return score;
  }, 0);
}

function buildLocalAnswer(query: string): ReferenceCard[] {
  const queryTerms = normalize(query)
    .split(' ')
    .filter(term => term.length > 2);

  if (queryTerms.length === 0) {
    return [];
  }

  const matches = surahs.flatMap(surah =>
    surah.verses.map(ayah => {
      const searchableText = [
        surah.transliteration,
        surah.translation ?? '',
        ayah.translation ?? '',
        ayah.text,
      ].join(' ');

      const score = scoreTextMatch(queryTerms, searchableText);

      return {
        score,
        card: {
          id: `${surah.id}-${ayah.id}`,
          title: `${surah.transliteration} ${ayah.id}`,
          body: ayah.translation ?? ayah.text,
          meta: `${surah.name} • Surah ${surah.id}`,
        } satisfies ReferenceCard,
      };
    }),
  );

  return matches
    .filter(item => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 4)
    .map(item => item.card);
}

function summarizeAnswer(query: string, quranMatches: ReferenceCard[], apiMatches: ReferenceCard[]) {
  if (quranMatches.length === 0 && apiMatches.length === 0) {
    return `I could not find a strong match for "${query}" yet. Try using words like patience, mercy, prayer, forgiveness, charity, or a surah name.`;
  }

  const parts: string[] = [];

  if (quranMatches.length > 0) {
    parts.push(`I found Quran references connected to "${query}".`);
    parts.push(`The strongest match is ${quranMatches[0].title}, which may help as a starting point.`);
  }

  if (apiMatches.length > 0) {
    parts.push('I also found related Islamic reference material from Quranpedia to guide further reading.');
  }

  parts.push('Please verify important religious rulings with a qualified scholar.');

  return parts.join(' ');
}

async function fetchQuranpediaReferences(query: string): Promise<ReferenceCard[]> {
  const response = await fetch(
    `https://api.quranpedia.net/v1/search/${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new Error('Unable to fetch reference material');
  }

  const data = (await response.json()) as QuranpediaSearchResponse;
  const references: ReferenceCard[] = [];

  data.topics?.items?.slice(0, 2).forEach((item, index) => {
    references.push({
      id: `topic-${index}`,
      title: item.topic?.name ?? 'Related topic',
      body: (item.highlighted_text ?? '').replace(/<[^>]+>/g, ''),
      meta: 'Quranpedia topic',
    });
  });

  data.books?.items?.slice(0, 2).forEach((item, index) => {
    references.push({
      id: `book-${index}`,
      title: item.book_info?.name ?? 'Related book',
      body: (item.highlighted_text ?? '').replace(/<[^>]+>/g, ''),
      meta: item.book_info?.author
        ? `Quranpedia book • ${item.book_info.author}`
        : 'Quranpedia book',
    });
  });

  data.fatwas?.items?.slice(0, 1).forEach((item, index) => {
    references.push({
      id: `fatwa-${index}`,
      title: item.fatwa?.ar_title ?? 'Related fatwa',
      body: item.fatwa?.question_summary ?? item.highlighted_text ?? '',
      meta: item.fatwa?.author
        ? `Quranpedia fatwa • ${item.fatwa.author}`
        : 'Quranpedia fatwa',
    });
  });

  data.notes?.items?.slice(0, 1).forEach((item, index) => {
    references.push({
      id: `note-${index}`,
      title: 'Related note',
      body: (item.note ?? item.highlighted_text ?? '').replace(/<[^>]+>/g, ''),
      meta: 'Quranpedia note',
    });
  });

  return references.filter(reference => reference.body.trim().length > 0);
}

function DeenAI() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const styles = createStyles(colors);

  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [answer, setAnswer] = useState<AnswerState | null>(null);

  const promptChips = useMemo(() => QUICK_PROMPTS, []);

  const submitQuestion = async (nextQuery?: string) => {
    const trimmedQuery = (nextQuery ?? query).trim();

    if (!trimmedQuery) {
      return;
    }

    setQuery(trimmedQuery);
    setSubmittedQuery(trimmedQuery);
    setErrorMessage('');
    setIsLoading(true);

    const quranMatches = buildLocalAnswer(trimmedQuery);

    try {
      const apiMatches = await fetchQuranpediaReferences(trimmedQuery);

      setAnswer({
        summary: summarizeAnswer(trimmedQuery, quranMatches, apiMatches),
        quranMatches,
        apiMatches,
      });
    } catch {
      setAnswer({
        summary: summarizeAnswer(trimmedQuery, quranMatches, []),
        quranMatches,
        apiMatches: [],
      });
      setErrorMessage(
        'Live reference search is unavailable right now. Showing Quran-based local results only.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.bgOrbA} />
      <View style={styles.bgOrbB} />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t('common_back')}</Text>
        </Pressable>
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>{t('screen_deen_ai_kicker')}</Text>
          <Text style={styles.title}>{t('screen_deen_ai_title')}</Text>
          <Text style={styles.subTitle}>{t('screen_deen_ai_subtitle')}</Text>
        </View>
      </View>

      <FlatList
        data={[{ key: 'content' }]}
        keyExtractor={item => item.key}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={() => (
          <View style={styles.contentWrap}>
            <View style={styles.searchCard}>
              <Text style={styles.inputLabel}>Ask an Islamic question</Text>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="For example: verses about sabr or forgiveness"
                placeholderTextColor={colors.textSoft}
                style={styles.input}
                multiline
                textAlignVertical="top"
              />
              <Pressable
                style={[styles.askButton, isLoading ? styles.askButtonDisabled : null]}
                onPress={() => {
                  submitQuestion().catch(() => undefined);
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.accentContrast} />
                ) : (
                  <>
                    <Icon name="sparkles" size={16} color={colors.accentContrast} />
                    <Text style={styles.askButtonText}>Ask Deen AI</Text>
                  </>
                )}
              </Pressable>
            </View>

            <View style={styles.chipsWrap}>
              {promptChips.map(prompt => (
                <Pressable
                  key={prompt}
                  style={styles.chip}
                  onPress={() => {
                    submitQuestion(prompt).catch(() => undefined);
                  }}
                >
                  <Text style={styles.chipText}>{prompt}</Text>
                </Pressable>
              ))}
            </View>

            {submittedQuery ? (
              <View style={styles.answerHeader}>
                <Text style={styles.answerHeaderLabel}>Latest question</Text>
                <Text style={styles.answerHeaderText}>{submittedQuery}</Text>
              </View>
            ) : null}

            {errorMessage ? (
              <View style={styles.noticeCard}>
                <Text style={styles.noticeText}>{errorMessage}</Text>
              </View>
            ) : null}

            {answer ? (
              <>
                <View style={styles.summaryCard}>
                  <Text style={styles.sectionTitle}>Answer</Text>
                  <Text style={styles.summaryText}>{answer.summary}</Text>
                </View>

                {answer.quranMatches.length > 0 ? (
                  <View style={styles.sectionBlock}>
                    <Text style={styles.sectionTitle}>Quran matches</Text>
                    {answer.quranMatches.map(item => (
                      <View key={item.id} style={styles.referenceCard}>
                        <Text style={styles.referenceTitle}>{item.title}</Text>
                        <Text style={styles.referenceBody}>{item.body}</Text>
                        <Text style={styles.referenceMeta}>{item.meta}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}

                {answer.apiMatches.length > 0 ? (
                  <View style={styles.sectionBlock}>
                    <Text style={styles.sectionTitle}>Related references</Text>
                    {answer.apiMatches.map(item => (
                      <View key={item.id} style={styles.referenceCard}>
                        <Text style={styles.referenceTitle}>{item.title}</Text>
                        <Text style={styles.referenceBody}>{item.body}</Text>
                        <Text style={styles.referenceMeta}>{item.meta}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </>
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Start with a question</Text>
                <Text style={styles.emptyText}>
                  Deen AI uses Quran matches from the app and free Quranpedia references to help you explore Islamic topics.
                </Text>
              </View>
            )}
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
      top: -100,
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
      width: 190,
      height: 190,
      borderRadius: 95,
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
    },
    contentWrap: {
      gap: 12,
    },
    searchCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
    },
    inputLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      minHeight: 110,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceStrong,
      color: colors.text,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 14,
    },
    askButton: {
      marginTop: 12,
      height: 46,
      borderRadius: 14,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    askButtonDisabled: {
      opacity: 0.8,
    },
    askButtonText: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.accentContrast,
    },
    chipsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 9,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chipText: {
      fontSize: 12,
      color: colors.text,
      fontWeight: '600',
    },
    answerHeader: {
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: colors.surfaceMuted,
      borderWidth: 1,
      borderColor: colors.borderSoft,
    },
    answerHeaderLabel: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.accent,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    answerHeaderText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '600',
    },
    noticeCard: {
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: colors.accentSoft,
      borderWidth: 1,
      borderColor: colors.border,
    },
    noticeText: {
      fontSize: 13,
      lineHeight: 19,
      color: colors.text,
    },
    summaryCard: {
      borderRadius: 18,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    sectionBlock: {
      gap: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
    },
    summaryText: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 22,
      color: colors.textMuted,
    },
    referenceCard: {
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
    },
    referenceTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
    },
    referenceBody: {
      marginTop: 6,
      fontSize: 13,
      lineHeight: 20,
      color: colors.textMuted,
    },
    referenceMeta: {
      marginTop: 8,
      fontSize: 12,
      color: colors.accent,
      fontWeight: '700',
    },
    emptyCard: {
      borderRadius: 18,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 18,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
    },
    emptyText: {
      marginTop: 6,
      fontSize: 14,
      lineHeight: 21,
      color: colors.textMuted,
    },
  });

export default DeenAI;
