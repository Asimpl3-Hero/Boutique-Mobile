import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, moderateScale } from '@theme';
import { BellIcon, ChevronLeftIcon } from '@components/ui';
import { styles } from './Header.styles';

export { WAVE_HEIGHT } from './Header.styles';

export interface HeaderProps {
  title?: string;
  onBellPress?: () => void;
  /** When provided, a back chevron replaces the left spacer. */
  onBackPress?: () => void;
}

const ICON_SIZE = moderateScale(24);

export const WAVE_PATH =
  'M0,192L48,176C96,160,192,128,288,117.3C384,107,480,117,576,149.3C672,181,768,235,864,261.3C960,288,1056,288,1152,261.3C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z';

/** Brand top bar: primary band with the BORCELLE title (Oi), bell action
 *  and an inverted wave edge flowing into the content. */
export const Header = ({
  title = 'BORCELLE',
  onBellPress,
  onBackPress,
}: HeaderProps) => (
  <View style={styles.wrapper}>
    <View style={styles.container}>
      {onBackPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={onBackPress}
          style={styles.iconButton}
        >
          <ChevronLeftIcon size={ICON_SIZE} color={colors.onPrimary} />
        </Pressable>
      ) : (
        // Spacer mirrors the bell so the title stays optically centered.
        <View style={styles.iconButton} />
      )}
      <Text style={styles.title}>{title}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Notificaciones"
        onPress={onBellPress}
        style={styles.iconButton}
      >
        <BellIcon size={ICON_SIZE} color={colors.onPrimary} />
      </Pressable>
    </View>
    <Svg
      pointerEvents="none"
      style={styles.wave}
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
    >
      <Path d={WAVE_PATH} fill={colors.primary} />
    </Svg>
  </View>
);
