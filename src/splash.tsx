import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppThemeColors, useAppTheme } from './theme';

type SplashProps = {
  label?: string;
};

function Splash({ label = 'Ajmer Garib Nawaz' }: SplashProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const entrance = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const entranceAnimation = Animated.timing(entrance, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    entranceAnimation.start();
    glowAnimation.start();
    return () => {
      entranceAnimation.stop();
      glowAnimation.stop();
    };
  }, [entrance, glow]);

  const mosqueStyle = {
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }),
      },
      { scale: entrance.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] }) },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View
        pointerEvents="none"
        style={[styles.glow, { opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.28, 0.68] }) }]}
      />
      <View style={styles.centerContent}>
        <Animated.View style={[styles.mosqueScene, mosqueStyle]}>
          <Text style={styles.crescent}>☪</Text>
          <View style={[styles.minaret, styles.leftMinaret]}>
            <View style={styles.minaretCap} />
            <View style={styles.minaretLight} />
          </View>
          <View style={[styles.minaret, styles.rightMinaret]}>
            <View style={styles.minaretCap} />
            <View style={styles.minaretLight} />
          </View>
          <View style={styles.dome}>
            <View style={styles.domeCrescent} />
          </View>
          <View style={styles.mosqueBody}>
            <View style={styles.arch} />
            <View style={styles.arch} />
            <View style={styles.arch} />
          </View>
          <View style={styles.base} />
        </Animated.View>
        <Animated.View style={{ opacity: entrance }}>
          <Text style={styles.title}>{label}</Text>
          <Text style={styles.subtitle}>Faith · Prayer · Peace</Text>
        </Animated.View>
      </View>
      <Text style={[styles.bottomLabel, { paddingBottom: safeAreaInsets.bottom + 16 }]}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</Text>
    </View>
  );
}

const createStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, overflow: 'hidden', backgroundColor: colors.background },
    glow: {
      position: 'absolute',
      width: 340,
      height: 340,
      borderRadius: 170,
      alignSelf: 'center',
      top: '22%',
      backgroundColor: colors.accentSoft,
    },
    centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    mosqueScene: { width: 260, height: 230, alignItems: 'center', justifyContent: 'flex-end' },
    crescent: { position: 'absolute', top: 0, right: 53, fontSize: 34, color: colors.accent },
    minaret: {
      position: 'absolute', bottom: 20, width: 26, height: 142, borderRadius: 8,
      alignItems: 'center', backgroundColor: colors.accent,
    },
    leftMinaret: { left: 20 },
    rightMinaret: { right: 20 },
    minaretCap: {
      position: 'absolute', top: -19, width: 0, height: 0,
      borderLeftWidth: 15, borderRightWidth: 15, borderBottomWidth: 20,
      borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: colors.accent,
    },
    minaretLight: { marginTop: 20, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accentContrast },
    dome: {
      position: 'absolute', bottom: 73, width: 142, height: 92,
      borderTopLeftRadius: 142, borderTopRightRadius: 142, backgroundColor: colors.accent,
    },
    domeCrescent: { position: 'absolute', alignSelf: 'center', top: -16, width: 5, height: 20, borderRadius: 4, backgroundColor: colors.accent },
    mosqueBody: {
      width: 192, height: 77, flexDirection: 'row', alignItems: 'flex-end',
      justifyContent: 'space-evenly', paddingHorizontal: 17, backgroundColor: colors.accent,
    },
    arch: { width: 34, height: 47, borderTopLeftRadius: 23, borderTopRightRadius: 23, backgroundColor: colors.background },
    base: { width: 232, height: 16, borderRadius: 8, backgroundColor: colors.accentStrong },
    title: { marginTop: 18, fontSize: 24, fontWeight: '800', letterSpacing: 0.3, color: colors.text, textAlign: 'center' },
    subtitle: { marginTop: 6, fontSize: 12, fontWeight: '700', letterSpacing: 1.1, color: colors.textMuted, textAlign: 'center' },
    bottomLabel: { position: 'absolute', left: 0, right: 0, bottom: 0, fontSize: 14, fontWeight: '600', color: colors.textMuted, textAlign: 'center' },
  });

export default Splash;
