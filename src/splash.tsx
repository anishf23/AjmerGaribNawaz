import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppThemeColors, useAppTheme } from './theme';

type SplashProps = {
  label?: string;
};

function Splash({ label = 'MyGNI' }: SplashProps) {
  const safeAreaInsets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Image
          source={require('../assets/images/splash-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.bottomLabel, { paddingBottom: safeAreaInsets.bottom + 16 }]}>
        {label}
      </Text>
    </View>
  );
}

const createStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centerContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: 140,
      height: 140,
    },
    bottomLabel: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
  });

export default Splash;
