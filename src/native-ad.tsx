import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
  TestIds,
} from 'react-native-google-mobile-ads';

const PRODUCTION_UNIT_ID = 'ca-app-pub-7672039594265570/6762695293';
const UNIT_ID = __DEV__ ? TestIds.NATIVE : PRODUCTION_UNIT_ID;

export function HomeNativeAd() {
  const [nativeAd, setNativeAd] = useState<NativeAd>();

  useEffect(() => {
    let disposed = false;
    let loadedAd: NativeAd | undefined;

    NativeAd.createForAdRequest(UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
      startVideoMuted: true,
    })
      .then(ad => {
        loadedAd = ad;
        if (disposed) {
          ad.destroy();
          return;
        }
        setNativeAd(ad);
      })
      .catch(() => undefined);

    return () => {
      disposed = true;
      loadedAd?.destroy();
    };
  }, []);

  if (!nativeAd) return null;

  return (
    <NativeAdView nativeAd={nativeAd} style={styles.card}>
      <Text style={styles.attribution}>Ad</Text>
      <View style={styles.header}>
        {nativeAd.icon ? (
          <NativeAsset assetType={NativeAssetType.ICON}>
            <Image source={{ uri: nativeAd.icon.url }} style={styles.icon} />
          </NativeAsset>
        ) : null}
        <View style={styles.copy}>
          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <Text numberOfLines={2} style={styles.headline}>{nativeAd.headline}</Text>
          </NativeAsset>
          {nativeAd.advertiser ? (
            <NativeAsset assetType={NativeAssetType.ADVERTISER}>
              <Text numberOfLines={1} style={styles.advertiser}>{nativeAd.advertiser}</Text>
            </NativeAsset>
          ) : null}
        </View>
      </View>
      {nativeAd.mediaContent ? <NativeMediaView style={styles.media} /> : null}
      {nativeAd.body ? (
        <NativeAsset assetType={NativeAssetType.BODY}>
          <Text numberOfLines={2} style={styles.body}>{nativeAd.body}</Text>
        </NativeAsset>
      ) : null}
      {nativeAd.callToAction ? (
        <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
          <Text style={styles.cta}>{nativeAd.callToAction}</Text>
        </NativeAsset>
      ) : null}
    </NativeAdView>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, marginBottom: 22, padding: 14, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' },
  attribution: { position: 'absolute', top: 10, right: 12, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden', fontSize: 10, fontWeight: '700', color: '#64748B', backgroundColor: '#F1F5F9' },
  header: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 44, height: 44, marginRight: 10, borderRadius: 10, backgroundColor: '#F1F5F9' },
  copy: { flex: 1 },
  headline: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  advertiser: { marginTop: 2, fontSize: 12, color: '#64748B' },
  media: { width: '100%', height: 160, marginTop: 12, borderRadius: 10, overflow: 'hidden' },
  body: { marginTop: 10, fontSize: 13, lineHeight: 19, color: '#475569' },
  cta: { alignSelf: 'flex-start', marginTop: 12, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 8, overflow: 'hidden', fontSize: 13, fontWeight: '700', color: '#FFFFFF', backgroundColor: '#0F766E' },
});
