import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import { colors } from '@theme';
import { SEGMENT_RATIO, styles } from './ProgressBar.styles';

export interface ProgressBarProps {
  /** 0–1 for determinate mode; omit for the indeterminate sweep. */
  progress?: number;
  color?: string;
}

/** Minimalist thin bar: continuous sweep while loading, solid fill for
 *  terminal states. Color comes from the caller (state tokens). */
export const ProgressBar = ({ progress, color }: ProgressBarProps) => {
  const barColor = color ?? colors.primary;
  const indeterminate = progress === undefined;
  const [trackWidth, setTrackWidth] = useState(0);
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!indeterminate) {
      return;
    }
    const loop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 1100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [indeterminate, sweep]);

  const segmentWidth = trackWidth * SEGMENT_RATIO;
  const translateX = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: [-segmentWidth, trackWidth],
  });

  return (
    <View
      accessibilityRole="progressbar"
      style={styles.track}
      onLayout={event => setTrackWidth(event.nativeEvent.layout.width)}
    >
      {indeterminate ? (
        <Animated.View
          testID="progress-fill"
          style={[
            styles.fill,
            {
              width: segmentWidth,
              backgroundColor: barColor,
              transform: [{ translateX }],
            },
          ]}
        />
      ) : (
        <View
          testID="progress-fill"
          style={[
            styles.fill,
            {
              width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      )}
    </View>
  );
};
