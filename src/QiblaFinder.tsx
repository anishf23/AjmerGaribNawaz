import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PermissionsAndroid, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import CompassHeading from 'react-native-compass-heading';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../App';
import { useLocalization } from './localization';
import { AppThemeColors, useAppTheme } from './theme';

const DEFAULT_LOCATION = { latitude: 19.076, longitude: 72.8777, label: 'Mumbai, India' };
const KAABA_LATITUDE = 21.4225;
const KAABA_LONGITUDE = 39.8262;

function getQiblaBearing(latitude: number, longitude: number) {
  const radians = Math.PI / 180;
  const lat1 = latitude * radians;
  const lat2 = KAABA_LATITUDE * radians;
  const deltaLon = (KAABA_LONGITUDE - longitude) * radians;
  return ((Math.atan2(Math.sin(deltaLon), Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(deltaLon)) / radians) + 360) % 360;
}

function QiblaFinder() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const styles = createStyles(colors);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [heading, setHeading] = useState(0);
  const [locationStatus, setLocationStatus] = useState('Using current location');
  const qiblaBearing = useMemo(() => getQiblaBearing(location.latitude, location.longitude), [location.latitude, location.longitude]);
  const needleRotation = ((qiblaBearing - heading + 540) % 360) - 180;
  const isFacingQibla = Math.abs(needleRotation) <= 5;

  const loadLocation = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: 'Location permission',
          message: 'Your location is used to calculate the Qibla direction.',
          buttonNegative: 'Cancel',
          buttonPositive: 'Allow',
        });
        if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
          setLocationStatus('Location permission denied — using Mumbai');
          return;
        }
      } else {
        await Geolocation.requestAuthorization();
      }
      Geolocation.getCurrentPosition(
        position => {
          setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude, label: 'Current location' });
          setLocationStatus('Live location found');
        },
        () => setLocationStatus('Location unavailable — using Mumbai'),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 },
      );
    } catch {
      setLocationStatus('Location unavailable — using Mumbai');
    }
  }, []);

  useEffect(() => {
    loadLocation();
    CompassHeading.start(3, ({ heading: nextHeading }: { heading: number }) => setHeading(Math.round(nextHeading)));
    return () => CompassHeading.stop();
  }, [loadLocation]);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}><Text style={styles.backButtonText}>{t('common_back')}</Text></Pressable>
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>{t('screen_qibla_kicker')}</Text>
          <Text style={styles.title}>{t('screen_qibla_title')}</Text>
          <Text style={styles.subTitle}>{isFacingQibla ? 'You are facing the Kaaba' : 'Turn your phone until the Kaaba marker points up.'}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.compassCard}>
          <Text style={styles.compassLabel}>QIBLA DIRECTION</Text>
          <View style={styles.compass}>
            <Text style={[styles.direction, styles.north]}>N</Text><Text style={[styles.direction, styles.east]}>E</Text><Text style={[styles.direction, styles.south]}>S</Text><Text style={[styles.direction, styles.west]}>W</Text>
            <View style={styles.compassRing} />
            <View style={[styles.needleWrap, { transform: [{ rotate: `${needleRotation}deg` }] }]}><View style={styles.kaabaMarker}><Text style={styles.kaabaText}>☪</Text></View><View style={styles.needle} /></View>
            <View style={styles.compassCenter} />
          </View>
          <Text style={styles.compassValue}>{Math.round(qiblaBearing)}° Qibla</Text>
          <Text style={styles.compassHint}>Phone heading: {heading}° • {isFacingQibla ? 'Aligned' : `${Math.round(Math.abs(needleRotation))}° to turn`}</Text>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}><View><Text style={styles.infoTitle}>{t('screen_qibla_location')}</Text><Text style={styles.infoText}>{location.label}</Text></View><Pressable style={styles.refreshButton} onPress={loadLocation}><Text style={styles.refreshText}>Refresh</Text></Pressable></View>
          <Text style={styles.infoMeta}>{locationStatus}{'\n'}Latitude: {location.latitude.toFixed(4)} | Longitude: {location.longitude.toFixed(4)}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: AppThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background }, header: { paddingTop: 10, paddingHorizontal: 16, marginBottom: 16 }, backButton: { alignSelf: 'flex-start', backgroundColor: colors.surfaceStrong, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7, marginBottom: 10 }, backButtonText: { fontSize: 13, fontWeight: '800', color: colors.accent }, heroCard: { borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 14 }, kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1, color: colors.accent, marginBottom: 4 }, title: { fontSize: 28, fontWeight: '800', color: colors.text }, subTitle: { marginTop: 4, fontSize: 13, lineHeight: 19, color: colors.textMuted }, content: { paddingHorizontal: 16, gap: 12 }, compassCard: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 20, alignItems: 'center' }, compassLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 1, color: colors.accent, marginBottom: 16 }, compass: { width: 246, height: 246, borderRadius: 123, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border }, compassRing: { position: 'absolute', width: 202, height: 202, borderRadius: 101, borderWidth: 1, borderColor: colors.borderSoft }, direction: { position: 'absolute', fontSize: 14, fontWeight: '800', color: colors.textSoft }, north: { top: 13, color: colors.accent }, east: { right: 15 }, south: { bottom: 12 }, west: { left: 15 }, needleWrap: { position: 'absolute', top: 21, left: 94, width: 58, height: 204, alignItems: 'center', justifyContent: 'flex-start' }, needle: { width: 4, height: 60, backgroundColor: colors.accent, borderRadius: 2 }, kaabaMarker: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }, kaabaText: { color: colors.accentContrast, fontSize: 22 }, compassCenter: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.text, borderWidth: 4, borderColor: colors.surfaceMuted }, compassValue: { marginTop: 18, fontSize: 25, fontWeight: '800', color: colors.text }, compassHint: { marginTop: 6, fontSize: 13, color: colors.textMuted, textAlign: 'center' }, infoCard: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14 }, infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }, infoTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 4 }, infoText: { fontSize: 14, color: colors.text }, infoMeta: { marginTop: 10, fontSize: 12, color: colors.textMuted, lineHeight: 18 }, refreshButton: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10 }, refreshText: { color: colors.accent, fontWeight: '800', fontSize: 12 },
});

export default QiblaFinder;
