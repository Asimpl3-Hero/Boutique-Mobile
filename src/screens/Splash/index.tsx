import React, { useEffect, useRef } from 'react';
import { Animated, Easing, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandLogo } from '@components/ui';
import { APP_VERSION } from '@lib';
import { moderateScale } from '@theme';
import { styles } from './Splash.styles';

const ENTER_DURATION_MS = 700;
const VERSION_DELAY_MS = 250;

/** Screen 1 of the flow: brand splash with a soft entrance animation. */
export const SplashScreen = () => {
  const { width, height } = useWindowDimensions();

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;
  const versionOpacity = useRef(new Animated.Value(0)).current;
  const versionShift = useRef(new Animated.Value(moderateScale(8))).current;

  useEffect(() => {
    const easing = Easing.out(Easing.cubic);
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: ENTER_DURATION_MS,
        easing,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: ENTER_DURATION_MS,
        easing,
        useNativeDriver: true,
      }),
      Animated.timing(versionOpacity, {
        toValue: 1,
        duration: ENTER_DURATION_MS,
        delay: VERSION_DELAY_MS,
        easing,
        useNativeDriver: true,
      }),
      Animated.timing(versionShift, {
        toValue: 0,
        duration: ENTER_DURATION_MS,
        delay: VERSION_DELAY_MS,
        easing,
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoOpacity, logoScale, versionOpacity, versionShift]);

  const logoSize = Math.min(width, height) * 0.6;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}
      >
        <BrandLogo size={logoSize} />
      </Animated.View>
      <Animated.Text
        style={[
          styles.version,
          {
            opacity: versionOpacity,
            transform: [{ translateY: versionShift }],
          },
        ]}
      >
        {`v${APP_VERSION}`}
      </Animated.Text>
    </SafeAreaView>
  );
};
