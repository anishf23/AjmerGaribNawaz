import React, { useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { languages, useLocalization } from './localization';
import { AppThemeColors, ColorTheme, ThemeMode, useAppTheme } from './theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type InfoMenuItem = {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
};

const themeOptions: ThemeMode[] = ['light', 'dark', 'system'];

const colorThemeOptions: { key: ColorTheme; name: string; color: string }[] = [
  { key: 'default', name: 'Default Green', color: '#cf7f0fff' },
  { key: 'blue', name: 'Ocean Blue', color: '#2563eb' },
  { key: 'green', name: 'Forest Green', color: '#16a34a' },
  { key: 'purple', name: 'Royal Purple', color: '#9333ea' },
  { key: 'orange', name: 'Sunset Orange', color: '#ea580c' },
];

function Info() {
  const { colors, mode, resolvedMode, colorTheme, setMode, setColorTheme } = useAppTheme();
  const { language, setLanguage, t } = useLocalization();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const styles = createStyles(colors);
  const [showLanguageList, setShowLanguageList] = useState(false);
  const [showColorThemeModal, setShowColorThemeModal] = useState(false);

  const activeLanguageName = useMemo(
    () => languages.find(item => item.code === language)?.name ?? 'English',
    [language],
  );

  const openUrl = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert(t('common_unable_open'), t('common_link_unsupported'));
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert(t('common_something_wrong'), t('common_try_again'));
    }
  };

  const showComingSoon = (title: string) => {
    Alert.alert(title, t('info_coming_soon'));
  };

  const onShareApp = async () => {
    try {
      await Share.share({
        message: t('info_share_message'),
      });
    } catch {
      Alert.alert(t('info_share_failed'), t('info_share_failed_subtitle'));
    }
  };

  const onRateApp = async () => {
    const packageId = 'com.ajmer.garibnawaz';
    const marketUrl = `market://details?id=${packageId}`;
    const webUrl = `https://play.google.com/store/apps/details?id=${packageId}`;
    const canOpenMarket = await Linking.canOpenURL(marketUrl);
    if (canOpenMarket) {
      await openUrl(marketUrl);
      return;
    }
    await openUrl(webUrl);
  };

  const menuItems: InfoMenuItem[] = [
    {
      title: t('info_about_title'),
      subtitle: t('info_about_subtitle'),
      icon: 'ℹ️',
      onPress: () => navigation.navigate('AboutUs'),
    },
    {
      title: t('info_contact_title'),
      subtitle: t('info_contact_subtitle'),
      icon: '✉️',
      onPress: () => openUrl('mailto:support@mygni.app'),
    },
    {
      title: t('info_privacy_title'),
      subtitle: t('info_privacy_subtitle'),
      icon: '🔒',
      onPress: () => navigation.navigate('PrivacyPolicy'),
    },
    {
      title: t('info_terms_title'),
      subtitle: t('info_terms_subtitle'),
      icon: '📜',
      onPress: () => navigation.navigate('TermsAndConditions'),
    },
    {
      title: t('info_share_title'),
      subtitle: t('info_share_subtitle'),
      icon: '📤',
      onPress: onShareApp,
    },
    {
      title: t('info_more_apps_title'),
      subtitle: t('info_more_apps_subtitle'),
      icon: '📱',
      onPress: () =>
        openUrl('https://play.google.com/store/apps/developer?id=MyGNI'),
    },
    {
      title: t('info_rate_title'),
      subtitle: t('info_rate_subtitle'),
      icon: '⭐',
      onPress: onRateApp,
    },
  ];

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.bgOrbA} />
      <View style={styles.bgOrbB} />
      <View style={styles.heroCard}>
        <Text style={styles.kicker}>{t('info_kicker')}</Text>
        <Text style={styles.title}>{t('info_title')}</Text>
        <Text style={styles.subTitle}>{t('info_subtitle')}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.themeCard}>
          <View style={styles.themeHeader}>
            <Text style={styles.themeTitle}>{t('info_theme')}</Text>
            <Text style={styles.themeHint}>
              {t('common_active')}:{' '}
              {resolvedMode === 'dark' ? t('common_dark') : t('common_light')}
            </Text>
          </View>

          <View style={styles.themeOptionsRow}>
            {themeOptions.map(option => {
              const isActive = option === mode;
              const label =
                option === 'light'
                  ? t('common_light')
                  : option === 'dark'
                    ? t('common_dark')
                    : t('common_system');

              return (
                <Pressable
                  key={option}
                  style={[styles.themeOption, isActive ? styles.themeOptionActive : null]}
                  onPress={() => setMode(option)}
                >
                  <Text
                    style={[
                      styles.themeOptionText,
                      isActive ? styles.themeOptionTextActive : null,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Modal
            visible={showColorThemeModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowColorThemeModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{t('info_color_theme')}</Text>
                <Text style={styles.modalSubtitle}>{t('info_color_theme_hint')}</Text>
                <View style={styles.colorThemeButtonsRow}>
                  {colorThemeOptions.map(option => {
                    const isActive = option.key === colorTheme;
                    return (
                      <Pressable
                        key={option.key}
                        style={[
                          styles.colorThemeButton,
                          isActive ? styles.colorThemeButtonActive : null,
                        ]}
                        onPress={() => {
                          setColorTheme(option.key);
                          setShowColorThemeModal(false);
                        }}
                      >
                        <View
                          style={[
                            styles.colorThemeDot,
                            { backgroundColor: option.color },
                          ]}
                        />
                        <Text
                          style={[
                            styles.colorThemeOptionText,
                            isActive ? styles.colorThemeOptionTextActive : null,
                          ]}
                        >
                          {option.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Pressable
                  style={styles.modalCloseButton}
                  onPress={() => setShowColorThemeModal(false)}
                >
                  <Text style={styles.modalCloseButtonText}>{t('common_close')}</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <View style={styles.colorThemeSection}>
            <Pressable
              style={styles.colorThemeHeader}
              onPress={() => setShowColorThemeModal(true)}
            >
              <View style={styles.colorThemeTitleWrap}>
                <Text style={styles.themeTitle}>{t('info_color_theme')}</Text>
                <Text style={styles.menuSubText}>{t('info_color_theme_hint')}</Text>
              </View>
              <View style={styles.colorThemePreview}>
                <View
                  style={[
                    styles.colorThemePreviewDot,
                    { backgroundColor: colorThemeOptions.find(t => t.key === colorTheme)?.color || colors.accent }
                  ]}
                />
                <Text style={styles.themeHint}>
                  {colorThemeOptions.find(t => t.key === colorTheme)?.name || 'Default'}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.themeCard}>
          <Pressable
            style={styles.languageHeader}
            onPress={() => setShowLanguageList(current => !current)}
          >
            <View style={styles.languageTitleWrap}>
              <Text style={styles.themeTitle}>{t('info_language')}</Text>
              <Text style={styles.menuSubText}>{t('info_language_hint')}</Text>
            </View>
            <Text style={styles.themeHint}>{activeLanguageName}</Text>
          </Pressable>

          {showLanguageList ? (
            <View style={styles.languageList}>
              <Text style={styles.languageListTitle}>{t('info_choose_language')}</Text>
              {languages.map(item => {
                const isActive = item.code === language;

                return (
                  <Pressable
                    key={item.code}
                    style={[
                      styles.languageOption,
                      isActive ? styles.languageOptionActive : null,
                    ]}
                    onPress={() => {
                      setLanguage(item.code);
                      setShowLanguageList(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.languageOptionText,
                        isActive ? styles.languageOptionTextActive : null,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>

        {menuItems.map(item => (
          <Pressable key={item.title} style={styles.menuCard} onPress={item.onPress}>
            <View style={styles.rowLeft}>
              <View style={styles.iconWrap}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <View style={styles.textWrap}>
                <Text style={styles.menuText}>{item.title}</Text>
                <Text style={styles.menuSubText}>{item.subtitle}</Text>
              </View>
            </View>
            <Text style={styles.arrow}>{'>'}</Text>
          </Pressable>
        ))}
      </ScrollView>
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
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: colors.orbPrimary,
      top: -100,
      left: -60,
    },
    bgOrbB: {
      position: 'absolute',
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: colors.orbSecondary,
      right: -50,
      top: 20,
    },
    heroCard: {
      marginTop: 16,
      marginHorizontal: 16,
      marginBottom: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 18,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
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
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 108, // Increased from 20 to 108 to account for bottom tab
      gap: 10,
    },
    themeCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
      elevation: 2,
    },
    themeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
      gap: 12,
    },
    languageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    languageTitleWrap: {
      flex: 1,
    },
    themeTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },
    themeHint: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textMuted,
    },
    themeOptionsRow: {
      flexDirection: 'row',
      gap: 8,
    },
    themeOption: {
      flex: 1,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceMuted,
      paddingVertical: 12,
      alignItems: 'center',
    },
    themeOptionActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    themeOptionText: {
      fontSize: 13,
      fontWeight: '800',
      color: colors.textMuted,
    },
    themeOptionTextActive: {
      color: colors.accentContrast,
    },
    colorThemeSection: {
      marginTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.borderSoft,
      paddingTop: 14,
    },
    colorThemeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
    },
    colorThemeTitleWrap: {
      flex: 1,
    },
    colorThemePreview: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    colorThemePreviewDot: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      width: '100%',
      maxWidth: 400,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 4,
    },
    modalSubtitle: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 12,
    },
    colorThemeButtonsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    colorThemeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceMuted,
      paddingHorizontal: 10,
      paddingVertical: 10,
      minWidth: 120,
      flexBasis: '48%',
    },
    colorThemeButtonActive: {
      borderColor: colors.accent,
      backgroundColor: colors.accentSoft,
    },
    colorThemeDot: {
      width: 14,
      height: 14,
      borderRadius: 7,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: 8,
    },
    colorThemeOptionText: {
      color: colors.text,
      fontWeight: '700',
      fontSize: 12,
      flexShrink: 1,
    },
    colorThemeOptionTextActive: {
      color: colors.accent,
    },
    modalCloseButton: {
      borderRadius: 12,
      backgroundColor: colors.accent,
      paddingVertical: 10,
      alignItems: 'center',
    },
    modalCloseButtonText: {
      color: colors.accentContrast,
      fontWeight: '700',
      fontSize: 14,
    },
    languageList: {
      marginTop: 14,
      gap: 8,
    },
    languageListTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textMuted,
    },
    languageOption: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceMuted,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    languageOptionActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    languageOptionText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    languageOptionTextActive: {
      color: colors.accentContrast,
    },
    menuCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
      elevation: 2,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      fontSize: 18,
    },
    textWrap: {
      flexShrink: 1,
    },
    menuText: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    menuSubText: {
      marginTop: 2,
      fontSize: 12,
      color: colors.textMuted,
    },
    arrow: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.accent,
    },
  });

export default Info;
