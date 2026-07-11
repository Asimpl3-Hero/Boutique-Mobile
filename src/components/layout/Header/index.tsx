import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, moderateScale } from '@theme';
import { BellIcon, MenuIcon } from '@components/ui';
import { styles } from './Header.styles';

export interface HeaderProps {
  title?: string;
  onMenuPress?: () => void;
  onBellPress?: () => void;
}

const ICON_SIZE = moderateScale(24);

/** Home top bar: menu — brand title (Oi) — notifications bell. */
export const Header = ({
  title = 'BORCELLE',
  onMenuPress,
  onBellPress,
}: HeaderProps) => (
  <View style={styles.container}>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Menu"
      onPress={onMenuPress}
      style={styles.iconButton}
    >
      <MenuIcon size={ICON_SIZE} color={colors.text} />
    </Pressable>
    <Text style={styles.title}>{title}</Text>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Notifications"
      onPress={onBellPress}
      style={styles.iconButton}
    >
      <BellIcon size={ICON_SIZE} color={colors.text} />
    </Pressable>
  </View>
);
