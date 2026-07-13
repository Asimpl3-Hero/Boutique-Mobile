import React, { useState } from 'react';
import { Animated, Pressable, Text, TextInput, View } from 'react-native';
import { CheckIcon } from '@components/ui';
import { useColorCycle, validateEmail } from '@lib';
import { colors, moderateScale } from '@theme';
import { styles } from './SubscribeBanner.styles';

/** One-way blend duration; the cycle drifts back for a soft ping-pong. */
const BLEND_DURATION_MS = 3500;

/** Brand pair the band background drifts between. */
const BLEND_PALETTE = [colors.secondary, colors.primary];

/** Full-width newsletter band: email capture with inline validation. */
export const SubscribeBanner = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  // Background drifts between the two brand colors, forever.
  const backgroundColor = useColorCycle(BLEND_PALETTE, BLEND_DURATION_MS);

  const handleSubscribe = () => {
    if (subscribed) {
      return;
    }
    const validation = validateEmail(email);
    setError(validation);
    if (!validation) {
      setSubscribed(true);
    }
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Suscríbete</Text>
      </View>
      <Text style={styles.caption}>
        Novedades, lanzamientos y ofertas de Borcelle directo a tu correo.
      </Text>
      <View style={styles.formRow}>
        <TextInput
          accessibilityLabel="Email para suscribirte"
          style={styles.input}
          placeholder="tu@correo.com"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          editable={!subscribed}
          onChangeText={value => {
            setEmail(value);
            if (error) {
              setError(null);
            }
          }}
          onSubmitEditing={handleSubscribe}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={subscribed ? 'Suscrito' : 'Suscribirse'}
          accessibilityState={subscribed ? { disabled: true } : {}}
          style={[styles.button, subscribed && styles.buttonSuccess]}
          onPress={handleSubscribe}
        >
          {subscribed ? (
            <CheckIcon size={moderateScale(16)} color={colors.onSuccess} />
          ) : null}
          <Text
            style={[styles.buttonText, subscribed && styles.buttonTextSuccess]}
          >
            {subscribed ? '¡Suscrito!' : 'Suscribirse'}
          </Text>
        </Pressable>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Animated.View>
  );
};
