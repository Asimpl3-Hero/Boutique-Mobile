import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.container,
    gap: spacing.lg,
  },
  title: {
    ...typography.heading,
    color: colors.onPrimary,
    textAlign: 'center',
  },
  message: {
    ...typography.bodySm,
    color: colors.onPrimary,
    opacity: 0.9,
    textAlign: 'center',
  },
  barWrapper: {
    alignSelf: 'stretch',
    marginTop: spacing.md,
  },
  actions: {
    alignSelf: 'stretch',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  actionButton: {
    backgroundColor: colors.surface,
  },
});
