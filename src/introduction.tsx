import React, { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';

type Slide = {
  id: string;
  title: string;
  description: string;
  image: number;
};

type IntroductionProps = {
  onDone: () => void;
};

function Introduction({ onDone }: IntroductionProps) {
  const { width } = useWindowDimensions();
  const safeAreaInsets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const styles = createStyles(colors);
  const listRef = useRef<FlatList<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = useMemo<Slide[]>(
    () => [
      {
        id: '1',
        title: t('screen_intro_welcome_title'),
        description: t('screen_intro_welcome_text'),
        image: require('../assets/images/splash-logo.png'),
      },
      {
        id: '2',
        title: t('screen_intro_learn_title'),
        description: t('screen_intro_learn_text'),
        image: require('../assets/images/splash-logo.png'),
      },
      {
        id: '3',
        title: t('screen_intro_consistent_title'),
        description: t('screen_intro_consistent_text'),
        image: require('../assets/images/splash-logo.png'),
      },
    ],
    [t],
  );

  const onNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
      return;
    }
    onDone();
  };

  const renderItem = ({ item }: ListRenderItemInfo<Slide>) => (
    <View style={[styles.slide, { width }]}>
      <Image source={item.image} style={styles.slideImage} resizeMode="contain" />
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <View style={[styles.bottomArea, { paddingBottom: safeAreaInsets.bottom + 20 }]}>
        <View style={styles.dotsRow}>
          {slides.map((slide, index) => (
            <View
              key={slide.id}
              style={[styles.dot, index === currentIndex ? styles.dotActive : null]}
            />
          ))}
        </View>

        <Pressable style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1
              ? t('screen_intro_get_started')
              : t('screen_intro_next')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    slide: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 28,
    },
    slideImage: {
      width: 180,
      height: 180,
      marginBottom: 28,
    },
    slideTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 12,
    },
    slideDescription: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.textMuted,
      textAlign: 'center',
    },
    bottomArea: {
      paddingHorizontal: 24,
    },
    dotsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 20,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border,
    },
    dotActive: {
      width: 24,
      backgroundColor: colors.accent,
    },
    button: {
      backgroundColor: colors.accent,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    buttonText: {
      color: colors.accentContrast,
      fontSize: 16,
      fontWeight: '700',
    },
  });

export default Introduction;
