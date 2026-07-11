import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Splash is plain white by design (logo asset sits on white).
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.container,
    gap: spacing.lg,
  },
  version: {
    ...typography.caption,
    color: colors.text,
  },
});
