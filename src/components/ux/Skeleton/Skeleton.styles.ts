import { StyleSheet } from 'react-native';
import { colors, radius } from '@theme';

export const styles = StyleSheet.create({
  // Background is animated in the component (primary ⇄ secondary drift);
  // the soft opacity keeps the brand colors reading as placeholders.
  base: {
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    overflow: 'hidden',
    opacity: 0.55,
  },
});
