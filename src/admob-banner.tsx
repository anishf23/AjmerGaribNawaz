import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { getBannerFreeUntil } from './ad-rewards';

type AdMobBannerProps = {
  adUnitId?: string;
};

const PRODUCTION_UNIT_ID = 'ca-app-pub-7672039594265570/9744167573';
const DEFAULT_UNIT_ID = __DEV__ ? TestIds.BANNER : PRODUCTION_UNIT_ID;

export function AdMobBanner({ adUnitId = DEFAULT_UNIT_ID }: AdMobBannerProps) {
  const [isCheckingReward, setIsCheckingReward] = useState(true);
  const [bannerFreeUntil, setBannerFreeUntil] = useState(0);

  useEffect(() => {
    let active = true;
    let expiryTimer: ReturnType<typeof setTimeout> | undefined;

    getBannerFreeUntil()
      .then(expiresAt => {
        if (!active) return;
        setBannerFreeUntil(expiresAt);
        setIsCheckingReward(false);
        if (expiresAt) {
          expiryTimer = setTimeout(() => setBannerFreeUntil(0), Math.max(expiresAt - Date.now(), 0));
        }
      })
      .catch(() => {
        if (active) setIsCheckingReward(false);
      });

    return () => {
      active = false;
      if (expiryTimer) clearTimeout(expiryTimer);
    };
  }, []);

  if (isCheckingReward || bannerFreeUntil > Date.now() || !adUnitId) return null;

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
});
