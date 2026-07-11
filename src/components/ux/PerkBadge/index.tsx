import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './PerkBadge.styles';

export interface PerkBadgeProps {
  /** Small decorative SVG icon. */
  icon?: React.ReactNode;
  title: string;
  text: string;
}

/** Marketing perk chip: icon + uppercase title + short copy. */
export const PerkBadge = ({ icon, title, text }: PerkBadgeProps) => (
  <View style={styles.container}>
    {icon ?? null}
    <View style={styles.texts}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{text}</Text>
    </View>
  </View>
);
