import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../App';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';

type AmountField = {
  label: string;
  hint: string;
  value: string;
  onChangeText: (value: string) => void;
};

function parseAmount(value: string) {
  const normalized = value.replace(/,/g, '').trim();
  if (!normalized) {
    return 0;
  }

  const amount = Number(normalized);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function formatAmount(value: number) {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function ZakatCalculator() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const styles = createStyles(colors);

  const [cash, setCash] = useState('');
  const [goldValue, setGoldValue] = useState('');
  const [silverValue, setSilverValue] = useState('');
  const [businessAssets, setBusinessAssets] = useState('');
  const [investments, setInvestments] = useState('');
  const [debts, setDebts] = useState('');

  const fields: AmountField[] = [
    {
      label: t('screen_zakat_cash_balance'),
      hint: t('screen_zakat_cash_hint'),
      value: cash,
      onChangeText: setCash,
    },
    {
      label: t('screen_zakat_gold_value'),
      hint: t('screen_zakat_gold_hint'),
      value: goldValue,
      onChangeText: setGoldValue,
    },
    {
      label: t('screen_zakat_silver_value'),
      hint: t('screen_zakat_silver_hint'),
      value: silverValue,
      onChangeText: setSilverValue,
    },
    {
      label: t('screen_zakat_business_assets'),
      hint: t('screen_zakat_business_hint'),
      value: businessAssets,
      onChangeText: setBusinessAssets,
    },
    {
      label: t('screen_zakat_investments'),
      hint: t('screen_zakat_investments_hint'),
      value: investments,
      onChangeText: setInvestments,
    },
    {
      label: t('screen_zakat_debts'),
      hint: t('screen_zakat_debts_hint'),
      value: debts,
      onChangeText: setDebts,
    },
  ];

  const calculation = useMemo(() => {
    const cashAmount = parseAmount(cash);
    const goldAmount = parseAmount(goldValue);
    const silverAmount = parseAmount(silverValue);
    const businessAmount = parseAmount(businessAssets);
    const investmentsAmount = parseAmount(investments);
    const debtsAmount = parseAmount(debts);

    const totalAssets =
      cashAmount +
      goldAmount +
      silverAmount +
      businessAmount +
      investmentsAmount;
    const netZakatable = Math.max(totalAssets - debtsAmount, 0);
    const zakatDue = netZakatable * 0.025;

    return {
      cashAmount,
      goldAmount,
      silverAmount,
      businessAmount,
      investmentsAmount,
      debtsAmount,
      totalAssets,
      netZakatable,
      zakatDue,
    };
  }, [businessAssets, cash, debts, goldValue, investments, silverValue]);

  const hasInput =
    calculation.totalAssets > 0 || calculation.debtsAmount > 0;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.bgOrbA} />
        <View style={styles.bgOrbB} />

        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>{t('common_back')}</Text>
          </Pressable>
          <View style={styles.heroCard}>
            <Text style={styles.kicker}>{t('screen_zakat_kicker')}</Text>
            <Text style={styles.title}>{t('screen_zakat_title')}</Text>
            <Text style={styles.subTitle}>{t('screen_zakat_subtitle')}</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>{t('screen_zakat_note')}</Text>
            <Text style={styles.noticeText}>{t('screen_zakat_note_text')}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('screen_zakat_enter')}</Text>
            {fields.map(field => (
              <View key={field.label} style={styles.inputCard}>
                <Text style={styles.inputLabel}>{field.label}</Text>
                <Text style={styles.inputHint}>{field.hint}</Text>
                <TextInput
                  value={field.value}
                  onChangeText={field.onChangeText}
                  placeholder="0"
                  placeholderTextColor={colors.textSoft}
                  keyboardType="decimal-pad"
                  style={styles.input}
                />
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('screen_zakat_details')}</Text>

            <View style={styles.resultCard}>
              <ResultRow label={t('screen_zakat_cash_bank')} value={calculation.cashAmount} styles={styles} />
              <ResultRow label={t('screen_zakat_gold_value')} value={calculation.goldAmount} styles={styles} />
              <ResultRow label={t('screen_zakat_silver_value')} value={calculation.silverAmount} styles={styles} />
              <ResultRow
                label={t('screen_zakat_business_assets')}
                value={calculation.businessAmount}
                styles={styles}
              />
              <ResultRow
                label={t('screen_zakat_investments')}
                value={calculation.investmentsAmount}
                styles={styles}
              />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{t('screen_zakat_total_assets')}</Text>
                <Text style={styles.totalValue}>{formatAmount(calculation.totalAssets)}</Text>
              </View>
              <ResultRow
                label={t('screen_zakat_minus_debts')}
                value={calculation.debtsAmount}
                styles={styles}
                negative
              />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{t('screen_zakat_net_amount')}</Text>
                <Text style={styles.totalValue}>{formatAmount(calculation.netZakatable)}</Text>
              </View>
            </View>

            <View style={styles.zakatCard}>
              <Text style={styles.zakatLabel}>{t('screen_zakat_due')}</Text>
              <Text style={styles.zakatValue}>{formatAmount(calculation.zakatDue)}</Text>
              <Text style={styles.zakatHelp}>
                {hasInput
                  ? t('screen_zakat_due_text')
                  : t('screen_zakat_due_empty')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type ResultRowProps = {
  label: string;
  value: number;
  styles: ReturnType<typeof createStyles>;
  negative?: boolean;
};

function ResultRow({ label, value, styles, negative = false }: ResultRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={negative ? styles.rowValueNegative : styles.rowValue}>
        {negative ? '- ' : ''}
        {formatAmount(value)}
      </Text>
    </View>
  );
}

const createStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    bgOrbA: {
      position: 'absolute',
      top: -100,
      left: -50,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: colors.orbPrimary,
    },
    bgOrbB: {
      position: 'absolute',
      top: 40,
      right: -60,
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
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 24,
      gap: 14,
    },
    noticeCard: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderSoft,
      padding: 14,
    },
    noticeTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 4,
    },
    noticeText: {
      fontSize: 13,
      lineHeight: 19,
      color: colors.textMuted,
    },
    section: {
      gap: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
    },
    inputCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      gap: 6,
    },
    inputLabel: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
    },
    inputHint: {
      fontSize: 12,
      color: colors.textMuted,
      lineHeight: 18,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      backgroundColor: colors.surfaceStrong,
      color: colors.text,
      paddingHorizontal: 14,
      paddingVertical: Platform.OS === 'ios' ? 12 : 10,
      fontSize: 16,
      fontWeight: '700',
    },
    resultCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 9,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderSoft,
    },
    rowLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textMuted,
    },
    rowValue: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
    },
    rowValueNegative: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
    },
    totalLabel: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.accent,
    },
    totalValue: {
      fontSize: 17,
      fontWeight: '900',
      color: colors.accent,
    },
    zakatCard: {
      backgroundColor: colors.accentSoft,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    zakatLabel: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.textMuted,
      marginBottom: 6,
    },
    zakatValue: {
      fontSize: 30,
      fontWeight: '900',
      color: colors.accent,
    },
    zakatHelp: {
      marginTop: 6,
      fontSize: 13,
      lineHeight: 19,
      color: colors.textMuted,
    },
  });

export default ZakatCalculator;
