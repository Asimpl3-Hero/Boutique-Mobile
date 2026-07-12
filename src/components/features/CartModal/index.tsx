import React from 'react';
import { Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';
import { Button, PriceText } from '@components/ui';
import {
  useAppDispatch,
  useAppSelector,
  addItem,
  clear,
  removeItem,
  removeLine,
  selectCartItems,
  selectCartTotal,
} from '@store';
import { spacing } from '@theme';
import { styles } from './CartModal.styles';

export interface CartModalProps {
  visible: boolean;
  onClose: () => void;
  /** Fired by the checkout CTA (the modal closes itself first). */
  onCheckout?: () => void;
}

/** Cart quick view: glassmorphism backdrop with a bottom sheet listing
 *  items, editable quantities and the running total. */
export const CartModal = ({ visible, onClose, onCheckout }: CartModalProps) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  const checkout = () => {
    onClose();
    onCheckout?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView style={styles.fill} blurType="light" blurAmount={14} />
      <View style={styles.sheetWrapper}>
        <Pressable
          accessibilityLabel="Cerrar carrito"
          style={[styles.fill, styles.tint]}
          onPress={onClose}
        />
        <View
          style={[
            styles.panel,
            { paddingBottom: insets.bottom + spacing.lg },
          ]}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>Carrito</Text>

          {items.length === 0 ? (
            <Text style={styles.empty}>Tu carrito está vacío</Text>
          ) : (
            <>
              <ScrollView
                style={{ maxHeight: spacing.container * 14 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: spacing.md }}
              >
                {items.map(item => (
                  <View key={item.product.id} style={styles.itemRow}>
                    <Image
                      source={{ uri: item.product.imageUrl }}
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.product.name}
                      </Text>
                      <PriceText
                        valueInCents={item.product.priceInCents * item.quantity}
                        currency={item.product.currency}
                        style={styles.itemPrice}
                      />
                    </View>
                    <View style={styles.qtyRow}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Quitar uno de ${item.product.name}`}
                        style={styles.qtyButton}
                        onPress={() =>
                          item.quantity > 1
                            ? dispatch(removeItem(item.product.id))
                            : dispatch(removeLine(item.product.id))
                        }
                      >
                        <Text style={styles.qtyButtonText}>−</Text>
                      </Pressable>
                      <Text style={styles.qtyValue}>{item.quantity}</Text>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Agregar uno de ${item.product.name}`}
                        style={styles.qtyButton}
                        onPress={() => dispatch(addItem(item.product))}
                      >
                        <Text style={styles.qtyButtonText}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <PriceText valueInCents={total} style={styles.totalValue} />
              </View>
              <Button label="Finalizar compra" onPress={checkout} />
              <Button
                label="Limpiar carrito"
                onPress={() => dispatch(clear())}
                style={styles.clearButton}
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};
