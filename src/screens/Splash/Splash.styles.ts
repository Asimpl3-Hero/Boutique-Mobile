import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Splash is plain white by design (logo asset sits on white).
    backgroundColor: colors.surface,
    alignItems: 'center',
    paddingHorizontal: spacing.container,
  },
  logoArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  version: {
    ...typography.caption,
    color: colors.text,
    marginBottom: spacing.xl,
  },
});
