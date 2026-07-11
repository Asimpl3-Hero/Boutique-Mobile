import React, { useEffect, useRef } from 'react';
import { Animated, Easing, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandLogo } from '@components/ui';
import { APP_VERSION } from '@lib';
import { moderateScale } from '@theme';
// Type-only import: no runtime cycle with the navigation layer.
import type { RootStackScreenProps } from '@/navigation';
import { styles } from './Splash.styles';

const ENTER_DURATION_MS = 700;
const VERSION_DELAY_MS = 250;
/** Minimum time the brand stays on screen before moving to Home. */
export const SPLASH_DURATION_MS = 1800;

type SplashScreenProps = Partial<RootStackScreenProps<'Splash'>>;

/** Screen 1 of the flow: brand splash with a soft entrance animation. */
export const SplashScreen = ({ navigation }: SplashScreenProps) => {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!navigation) {
        return;
      }
      // Resilient boot: never strand the user on the splash.
      try {
        navigation.replace('Main');
      } catch {
        try {
          navigation.navigate('Main');
        } catch {
          // Navigator not ready — nothing else to do without crashing.
        }
      }
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [navigation]);

  const logoSize = Math.min(width, height) * 0.6;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.logoArea,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
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
