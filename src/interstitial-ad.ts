import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { AdEventType, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';

const PRODUCTION_UNIT_ID = 'ca-app-pub-7672039594265570/7391135279';
const UNIT_ID = __DEV__ ? TestIds.INTERSTITIAL : PRODUCTION_UNIT_ID;
const TASBIH_COMPLETIONS_KEY = 'INTERSTITIAL_TASBIH_COMPLETIONS';
const LAST_SHOWN_KEY = 'INTERSTITIAL_LAST_SHOWN_AT';
const COMPLETIONS_BEFORE_SHOWING = 3;
const SHOW_COOLDOWN_MS = 15 * 60 * 1000;
const RETRY_DELAY_MS = 30 * 1000;

let interstitial: InterstitialAd | null = null;
let isLoading = false;
let isShowing = false;
let retryTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleRetry() {
  if (retryTimer) return;

  retryTimer = setTimeout(() => {
    retryTimer = null;
    preloadInterstitialAd();
  }, RETRY_DELAY_MS);
}

export function preloadInterstitialAd() {
  if (Platform.OS !== 'android' || interstitial || isLoading) return;

  isLoading = true;
  const ad = InterstitialAd.createForAdRequest(UNIT_ID, {
    requestNonPersonalizedAdsOnly: true,
  });

  ad.addAdEventListener(AdEventType.LOADED, () => {
    isLoading = false;
    console.info('[InterstitialAd] loaded');
  });
  ad.addAdEventListener(AdEventType.CLOSED, () => {
    if (interstitial === ad) interstitial = null;
    isShowing = false;
    preloadInterstitialAd();
  });
  ad.addAdEventListener(AdEventType.ERROR, () => {
    if (interstitial === ad) interstitial = null;
    isLoading = false;
    isShowing = false;
    console.warn('[InterstitialAd] failed to load; retrying in 30 seconds');
    scheduleRetry();
  });

  interstitial = ad;
  ad.load();
}

/**
 * Called only once a user completes a Tasbih round. It never runs for tabs,
 * screen navigation, app launch, or an individual in-progress tap.
 */
export async function handleCompletedTasbihRound() {
  if (Platform.OS !== 'android') return;

  const [completionValue, lastShownValue] = await Promise.all([
    AsyncStorage.getItem(TASBIH_COMPLETIONS_KEY),
    AsyncStorage.getItem(LAST_SHOWN_KEY),
  ]);
  const completedRounds = Number.parseInt(completionValue ?? '0', 10) || 0;
  const lastShownAt = Number.parseInt(lastShownValue ?? '0', 10) || 0;
  const nextCompletedRounds = completedRounds + 1;

  await AsyncStorage.setItem(TASBIH_COMPLETIONS_KEY, String(nextCompletedRounds));

  if (
    nextCompletedRounds < COMPLETIONS_BEFORE_SHOWING ||
    Date.now() - lastShownAt < SHOW_COOLDOWN_MS ||
    isShowing ||
    !interstitial?.loaded
  ) {
    preloadInterstitialAd();
    return;
  }

  const ad = interstitial;
  isShowing = true;
  await AsyncStorage.multiSet([
    [TASBIH_COMPLETIONS_KEY, '0'],
    [LAST_SHOWN_KEY, String(Date.now())],
  ]);

  try {
    await ad.show();
  } catch (error) {
    console.warn('[InterstitialAd] failed to show', error);
    if (interstitial === ad) interstitial = null;
    isShowing = false;
    preloadInterstitialAd();
  }
}
