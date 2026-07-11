import React from 'react';
import { ScrollView } from 'react-native';
import { Chip } from '@components/ui';
import { styles } from './CategoryChips.styles';

export const DEFAULT_CATEGORIES = ['All', 'New Arrivals', 'Trending'];

export interface CategoryChipsProps {
  categories?: string[];
  active: string;
  onSelect: (category: string) => void;
}

/** Horizontal category filter row (presentational). */
export const CategoryChips = ({
  categories = DEFAULT_CATEGORIES,
  active,
  onSelect,
}: CategoryChipsProps) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.content}
  >
    {categories.map(category => (
      <Chip
        key={category}
        label={category}
        active={category === active}
        onPress={() => onSelect(category)}
      />
    ))}
  </ScrollView>
);
