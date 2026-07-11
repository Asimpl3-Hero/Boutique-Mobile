import React from 'react';
import { Text, View } from 'react-native';
import { CheckIcon } from '@components/ui';
import { colors, moderateScale } from '@theme';
import { styles } from './Stepper.styles';

export interface StepperProps {
  /** Step labels in order. Capped at four steps by design. */
  steps: string[];
  /** Zero-based index of the active step. */
  current: number;
}

const MAX_STEPS = 4;

type StepState = 'completed' | 'active' | 'pending';

const stateOf = (index: number, current: number): StepState => {
  if (index < current) {
    return 'completed';
  }
  return index === current ? 'active' : 'pending';
};

const STATE_LABEL: Record<StepState, string> = {
  completed: 'completado',
  active: 'activo',
  pending: 'pendiente',
};

/** Minimalist checkout progress: numbered dots joined by tinted segments.
 *  Purely presentational — next/back navigation belongs to the caller. */
export const Stepper = ({ steps, current }: StepperProps) => {
  const visible = steps.slice(0, MAX_STEPS);

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        {visible.map((label, index) => {
          const state = stateOf(index, current);
          return (
            <React.Fragment key={label}>
              {index > 0 ? (
                <View
                  style={[
                    styles.connector,
                    index <= current && styles.connectorDone,
                  ]}
                />
              ) : null}
              <View
                style={styles.step}
                accessibilityLabel={`Paso ${index + 1} ${label}: ${
                  STATE_LABEL[state]
                }`}
                accessibilityState={
                  state === 'active' ? { selected: true } : {}
                }
              >
                <View
                  style={[
                    styles.dot,
                    state === 'pending' && styles.dotPending,
                    state === 'active' && styles.dotActive,
                    state === 'completed' && styles.dotCompleted,
                  ]}
                >
                  {state === 'completed' ? (
                    <CheckIcon
                      size={moderateScale(16)}
                      color={colors.onPrimary}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.number,
                        state === 'active' && styles.numberActive,
                      ]}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.label,
                    state === 'active' && styles.labelActive,
                  ]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};
