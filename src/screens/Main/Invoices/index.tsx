import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@components/ui';
import { ScreenPlaceholder } from '@components/ux';
import { spacing } from '@theme';
import { navigationRef } from '@/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  devEntry: {
    paddingHorizontal: spacing.container,
    paddingBottom: spacing.xl * 4,
  },
});

/** Placeholder — purchase invoices land in a later task. */
export const InvoicesScreen = () => (
  <View style={styles.container}>
    <ScreenPlaceholder title="Facturas" subtitle="Facturas próximamente" />
    {__DEV__ ? (
      <View style={styles.devEntry}>
        <Button
          label="Demo de estados (dev)"
          variant="ghost"
          onPress={() => {
            if (navigationRef.isReady()) {
              navigationRef.navigate('StatusDemo');
            }
          }}
        />
      </View>
    ) : null}
  </View>
);
