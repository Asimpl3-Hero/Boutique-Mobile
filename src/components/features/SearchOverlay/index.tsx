import React, { useMemo, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';
import { SearchBar } from '@components/ui';
import { useAppSelector, selectProducts } from '@store';
import { styles } from './SearchOverlay.styles';

export interface SearchOverlayProps {
  visible: boolean;
  onClose: () => void;
  /** Fired when a suggestion is chosen (the overlay closes itself). */
  onSelectProduct?: (productId: string) => void;
}

const MAX_SUGGESTIONS = 4;

/** Accent-insensitive lowercase for matching "camison" → "Camisón". */
const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

/** Search takeover: glassmorphism backdrop, centered field on top and
 *  live product suggestions from the catalog. */
export const SearchOverlay = ({
  visible,
  onClose,
  onSelectProduct,
}: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  const products = useAppSelector(selectProducts);

  const suggestions = useMemo(() => {
    const needle = normalize(query.trim());
    const pool = needle
      ? products.filter(product => normalize(product.name).includes(needle))
      : products;
    return pool.slice(0, MAX_SUGGESTIONS);
  }, [products, query]);

  const close = () => {
    setQuery('');
    onClose();
  };

  const choose = (productId: string) => {
    close();
    onSelectProduct?.(productId);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <BlurView style={styles.fill} blurType="light" blurAmount={14} />
      <Pressable
        accessibilityLabel="Cerrar búsqueda"
        style={[styles.fill, styles.tint]}
        onPress={close}
      />
      <SafeAreaView edges={['top', 'left', 'right']} pointerEvents="box-none">
        <View style={styles.content}>
          <SearchBar value={query} onChangeText={setQuery} autoFocus />
          <View style={styles.panel}>
            <Text style={styles.panelLabel}>Sugerencias</Text>
            {suggestions.length === 0 ? (
              <Text style={styles.empty}>
                Sin resultados para «{query.trim()}»
              </Text>
            ) : (
              suggestions.map((product, index) => (
                <Pressable
                  key={product.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Sugerencia ${product.name}`}
                  onPress={() => choose(product.id)}
                  style={[styles.row, index > 0 && styles.rowDivider]}
                >
                  <Text style={styles.rowName} numberOfLines={1}>
                    {product.name}
                  </Text>
                </Pressable>
              ))
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
