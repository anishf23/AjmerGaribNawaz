import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from './theme';
import { useLocalization } from './localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { SafeAreaView } from 'react-native-safe-area-context';

const letters = [
  { arabic: 'ا', romaji: 'Alif' },
  { arabic: 'ب', romaji: 'Ba' },
  { arabic: 'ت', romaji: 'Ta' },
  { arabic: 'ث', romaji: 'Tha' },
  { arabic: 'ج', romaji: 'Jeem' },
  { arabic: 'ح', romaji: 'Ha' },
  { arabic: 'خ', romaji: 'Kha' },
  { arabic: 'د', romaji: 'Dal' },
  { arabic: 'ذ', romaji: 'Dhal' },
  { arabic: 'ر', romaji: 'Ra' },
  { arabic: 'ز', romaji: 'Zay' },
  { arabic: 'س', romaji: 'Seen' },
  { arabic: 'ش', romaji: 'Sheen' },
  { arabic: 'ص', romaji: 'Saad' },
  { arabic: 'ض', romaji: 'Daad' },
  { arabic: 'ط', romaji: 'Taa' },
  { arabic: 'ظ', romaji: 'Zaa' },
  { arabic: 'ع', romaji: 'Ayn' },
  { arabic: 'غ', romaji: 'Ghayn' },
  { arabic: 'ف', romaji: 'Fa' },
  { arabic: 'ق', romaji: 'Qaf' },
  { arabic: 'ك', romaji: 'Kaf' },
  { arabic: 'ل', romaji: 'Lam' },
  { arabic: 'م', romaji: 'Meem' },
  { arabic: 'ن', romaji: 'Noon' },
  { arabic: 'ه', romaji: 'Ha' },
  { arabic: 'و', romaji: 'Waw' },
  { arabic: 'ي', romaji: 'Ya' },
];

function Takti() {
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.backIcon, { color: colors.accent }]}>←</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('menu_takti')}</Text>
      </View>
      <Text style={styles.subtitle}>{t('menu_takti')} - Learn the letters</Text>
      <FlatList
        data={letters}
        keyExtractor={item => item.arabic}
        numColumns={3}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <View style={styles.letterCard}>
            <Text style={styles.arabic}>{item.arabic}</Text>
            <Text style={styles.rome}>{item.romaji}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginBottom: 4,
    },
    backButton: {
      marginRight: 12,
      padding: 6,
      borderRadius: 8,
    },
    backIcon: {
      fontSize: 20,
      fontWeight: '800',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '800',
    },
    content: {
      padding: 16,
      gap: 12,
      justifyContent: 'space-between',
    },
    subtitle: {
      fontSize: 14,
      color: colors.textMuted,
      marginHorizontal: 16,
      marginBottom: 10,
    },
    letterCard: {
      flex: 1,
      margin: 6,
      minWidth: 90,
      maxWidth: 110,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    arabic: {
      fontSize: 28,
      fontWeight: '900',
      color: colors.accent,
    },
    rome: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
  });

export default Takti;
