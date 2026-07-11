import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import { colors } from '@theme';
import { SEGMENT_RATIO, styles } from './ProgressBar.styles';

export interface ProgressBarProps {
  /** 0–1 for determinate mode; omit for the indeterminate sweep. */
  progress?: number;
  color?: string;
  /** Track (empty part) color; defaults to the muted token. */
  trackColor?: string;
}

/** Minimalist thin bar: continuous sweep while loading, animated fill for
 *  determinate progress. Color comes from the caller (state tokens). */
export const ProgressBar = ({
  progress,
  color,
  trackColor,
}: ProgressBarProps) => {
  const barColor = color ?? colors.primary;
  const indeterminate = progress === undefined;
  const [trackWidth, setTrackWidth] = useState(0);
  const sweep = useRef(new Animated.Value(0)).current;
  // Grows from empty toward each target instead of jumping.
  const fill = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    if (indeterminate || trackWidth === 0) {
      return;
    }
    const clamped = Math.min(Math.max(progress ?? 0, 0), 1);
    const animation = Animated.timing(fill, {
      toValue: clamped * trackWidth,
      duration: 550,
      easing: Easing.out(Easing.cubic),
      // Width cannot run on the native driver.
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [indeterminate, progress, trackWidth, fill]);

  const segmentWidth = trackWidth * SEGMENT_RATIO;
  const translateX = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: [-segmentWidth, trackWidth],
  });

  return (
    <View
      accessibilityRole="progressbar"
      style={[styles.track, trackColor ? { backgroundColor: trackColor } : null]}
      onLayout={event => {
        // Restart the sweep from the left once the track is measured,
        // so the segment never appears mid-run near the end.
        sweep.setValue(0);
        setTrackWidth(event.nativeEvent.layout.width);
      }}
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
        <Animated.View
          testID="progress-fill"
          style={[
            styles.fill,
            {
              width: fill,
              backgroundColor: barColor,
            },
          ]}
        />
      )}
    </View>
  );
};
