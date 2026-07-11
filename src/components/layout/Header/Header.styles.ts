import { StyleSheet } from 'react-native';
import { colors, moderateScale, spacing, typography } from '@theme';
import { touchTarget } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.container,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  iconButton: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.heading,
    fontSize: moderateScale(18),
    lineHeight: moderateScale(26),
    color: colors.text,
    letterSpacing: 1,
  },
});
