import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BAR_HEIGHT } from '@components/layout';
import { CartIcon } from '@components/ui';
import { useAppSelector, selectCartCount } from '@store';
import { colors, moderateScale, spacing } from '@theme';
import { styles } from './CartFab.styles';

export interface CartFabProps {
  onPress?: () => void;
}

/** Floating cart button: bag icon plus a quantity badge fed by the cart
 *  slice. Sits above the floating tab bar, safe-area aware. */
export const CartFab = ({ onPress }: CartFabProps) => {
  const insets = useSafeAreaInsets();
  const count = useAppSelector(selectCartCount);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Carrito, ${count} artículos`}
      onPress={onPress}
      style={[
        styles.fab,
        { bottom: BAR_HEIGHT + insets.bottom + spacing.xl + spacing.md },
      ]}
    >
      <CartIcon size={moderateScale(26)} color={colors.onPrimary} />
      {count > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
      ) : null}
    </Pressable>
  );
};
