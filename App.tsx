/**
 * Temporary theme probe screen — verifies bundled fonts (Oi + Instrument Sans)
 * and @theme tokens render on device. Replaced by the real bootstrap in the
 * navigation block (mobile-01 · Bloque 5).
 */
import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@theme';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
        edges={['top', 'bottom', 'left', 'right']}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: spacing.container,
            gap: spacing.lg,
            justifyContent: 'center',
          }}
        >
          <Text style={[typography.displayLg, { color: colors.primary }]}>
            Borcelle
          </Text>
          <Text style={[typography.heading, { color: colors.text }]}>
            Heading Oi 20
          </Text>
          <Text style={[typography.body, { color: colors.text }]}>
            Body — Instrument Sans Regular 16
          </Text>
          <Text style={[typography.button, { color: colors.secondary }]}>
            Button — Instrument Sans Medium 16
          </Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            Caption — Instrument Sans Regular 12
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
