import React from 'react';
import { Pressable, Text } from 'react-native';
import { moderateScale } from '@theme';
import { styles } from './Chip.styles';

export interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

// Pill is 36pt tall; hitSlop keeps the touch target at ≥44pt.
const HIT_SLOP = moderateScale(4);

export const Chip = ({ label, active = false, onPress }: ChipProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={active ? { selected: true } : {}}
    hitSlop={HIT_SLOP}
    onPress={onPress}
    style={[styles.base, active && styles.active]}
  >
    <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
  </Pressable>
);
