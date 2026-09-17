import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

type AdMobBannerProps = {
  /**
   * Supply a production banner unit ID when releasing the app.
   * When omitted, development builds safely use Google's test banner.
   */
  adUnitId?: string;
};

const DEFAULT_UNIT_ID = __DEV__ ? TestIds.BANNER : undefined;

export function AdMobBanner({ adUnitId = DEFAULT_UNIT_ID }: AdMobBannerProps) {
  // Never ship Google's test ad unit ID in a release build. Pass your own
  // production unit ID, for example: ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx.
  if (!adUnitId) {
    return null;
  }

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
