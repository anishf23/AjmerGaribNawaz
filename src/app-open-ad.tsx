import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { AdEventType, AppOpenAd, TestIds } from 'react-native-google-mobile-ads';

const PRODUCTION_UNIT_ID = 'ca-app-pub-7672039594265570/4683326868';
const UNIT_ID = __DEV__ ? TestIds.APP_OPEN : PRODUCTION_UNIT_ID;
// Avoid an ad for a quick task switch while still allowing a normal return to the app.
const MIN_BACKGROUND_DURATION_MS = 5 * 1000;
const SHOW_COOLDOWN_MS = 30 * 60 * 1000;
const MAX_AD_AGE_MS = 4 * 60 * 60 * 1000;
const RETRY_DELAY_MS = 30 * 1000;

let appOpenAd: AppOpenAd | null = null;
let loadedAt = 0;
let isLoading = false;
let isShowing = false;
let lastShownAt = 0;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let afterAdClosed: (() => void) | null = null;

function schedulePreloadRetry() {
  if (retryTimer) return;

  retryTimer = setTimeout(() => {
    retryTimer = null;
    preloadAppOpenAd();
  }, RETRY_DELAY_MS);
}

function preloadAppOpenAd() {
  if (Platform.OS !== 'android' || appOpenAd || isLoading) return;

  isLoading = true;
  const ad = AppOpenAd.createForAdRequest(UNIT_ID, {
    requestNonPersonalizedAdsOnly: true,
  });

  ad.addAdEventListener(AdEventType.LOADED, () => {
    loadedAt = Date.now();
    isLoading = false;
    console.info('[AppOpenAd] loaded');
  });
  ad.addAdEventListener(AdEventType.OPENED, () => {
    lastShownAt = Date.now();
  });
  ad.addAdEventListener(AdEventType.CLOSED, () => {
    if (appOpenAd === ad) appOpenAd = null;
    isShowing = false;
    const continueApp = afterAdClosed;
    afterAdClosed = null;
    preloadAppOpenAd();
    continueApp?.();
  });
  ad.addAdEventListener(AdEventType.ERROR, () => {
    if (appOpenAd === ad) appOpenAd = null;
    isLoading = false;
    isShowing = false;
    console.warn('[AppOpenAd] failed to load; retrying in 30 seconds');
    schedulePreloadRetry();
  });

  appOpenAd = ad;
  ad.load();
}

export function showAppOpenAdAfterSplash(onComplete: () => void) {
  const ad = appOpenAd;
  const isExpired = Boolean(ad?.loaded) && Date.now() - loadedAt >= MAX_AD_AGE_MS;

  if (!ad?.loaded || isShowing || isExpired) {
    if (isExpired) {
      appOpenAd = null;
    }
    preloadAppOpenAd();
    onComplete();
    return;
  }

  isShowing = true;
  afterAdClosed = onComplete;
  ad.show().catch(() => {
    if (appOpenAd === ad) appOpenAd = null;
    isShowing = false;
    const continueApp = afterAdClosed;
    afterAdClosed = null;
    preloadAppOpenAd();
    continueApp?.();
  });
}

function showAppOpenAdIfAvailable() {
  const ad = appOpenAd;
  const isExpired = Boolean(ad?.loaded) && Date.now() - loadedAt >= MAX_AD_AGE_MS;
  const isInCooldown = Date.now() - lastShownAt < SHOW_COOLDOWN_MS;

  if (!ad?.loaded || isShowing || isExpired || isInCooldown) {
    console.info('[AppOpenAd] not shown', { loaded: Boolean(ad?.loaded), isShowing, isExpired, isInCooldown });
    if (isExpired || !ad) {
      appOpenAd = null;
      preloadAppOpenAd();
    }
    return;
  }

  isShowing = true;
  ad.show().catch(() => {
    if (appOpenAd === ad) appOpenAd = null;
    isShowing = false;
    preloadAppOpenAd();
  });
}

/**
 * Handles app-open ads for background-to-foreground events; splash handling is
 * coordinated separately before Main Tabs are shown to returning users.
 */
export function AppOpenAdController() {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const backgroundedAt = useRef<number | null>(null);

  useEffect(() => {
    preloadAppOpenAd();

    const subscription = AppState.addEventListener('change', nextState => {
      const wasBackgrounded = /inactive|background/.test(appState.current);
      const isForegrounded = nextState === 'active';

      if (!isForegrounded) {
        backgroundedAt.current ??= Date.now();
      } else if (wasBackgrounded) {
        const backgroundDuration = Date.now() - (backgroundedAt.current ?? Date.now());
        backgroundedAt.current = null;
        console.info('[AppOpenAd] foregrounded', { backgroundDuration });
        if (backgroundDuration >= MIN_BACKGROUND_DURATION_MS) {
          showAppOpenAdIfAvailable();
        }
      }

      appState.current = nextState;
    });

    return () => subscription.remove();
  }, []);

  return null;
}
