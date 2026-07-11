import React from 'react';
import { TextInput, View } from 'react-native';
import { colors, moderateScale } from '@theme';
import { SearchIcon } from '../icons';
import { styles } from './SearchBar.styles';

export interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Buscar productos',
  editable = true,
}: SearchBarProps) => (
  <View style={styles.container}>
    <SearchIcon size={moderateScale(20)} color={colors.textMuted} />
    <TextInput
      accessibilityLabel={placeholder}
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      editable={editable}
      returnKeyType="search"
    />
  </View>
);
