import React from 'react';
import { Modal, Text, View } from 'react-native';
import {
  Button,
  DeniedIcon,
  DoneIcon,
  LoadingIcon,
} from '@components/ui';
import { colors, moderateScale } from '@theme';
import { CircularReveal } from '../CircularReveal';
import { ProgressBar } from '../ProgressBar';
import { styles } from './StatusScreen.styles';

export type StatusState = 'loading' | 'success' | 'error';

export interface StatusScreenProps {
  visible: boolean;
  state: StatusState;
  /** Defaults per state when omitted. */
  title?: string;
  message?: string;
  /** Error only: offers a retry action. */
  onRetry?: () => void;
  /** Terminal states: close/continue action. */
  onDone?: () => void;
}

const STATE_COLOR: Record<StatusState, string> = {
  loading: colors.primary,
  success: colors.success,
  error: colors.error,
};

const DEFAULT_TITLE: Record<StatusState, string> = {
  loading: 'Procesando…',
  success: '¡Todo listo!',
  error: 'Algo salió mal',
};

const ICON_SIZE = moderateScale(72);

/** Full-screen status: circular reveal in the state color, SVG feedback
 *  icon, minimalist progress bar and optional actions. Presentational —
 *  the caller decides the state (e.g. checkout maps payment results). */
export const StatusScreen = ({
  visible,
  state,
  title,
  message,
  onRetry,
  onDone,
}: StatusScreenProps) => (
  <Modal visible={visible} animationType="fade" onRequestClose={() => {}}>
    <View style={styles.container}>
      <CircularReveal color={STATE_COLOR[state]} active durationMs={550} />
      <View style={styles.content}>
        {state === 'loading' ? (
          <LoadingIcon size={ICON_SIZE} color={colors.onPrimary} />
        ) : state === 'success' ? (
          <DoneIcon size={ICON_SIZE} color={colors.onSuccess} />
        ) : (
          <DeniedIcon size={ICON_SIZE} color={colors.onError} />
        )}
        <Text style={styles.title}>{title ?? DEFAULT_TITLE[state]}</Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <View style={styles.barWrapper}>
          <ProgressBar
            progress={state === 'loading' ? undefined : 1}
            color={colors.surface}
          />
        </View>
        {state !== 'loading' ? (
          <View style={styles.actions}>
            {state === 'error' && onRetry ? (
              <Button
                label="Reintentar"
                variant="ghost"
                onPress={onRetry}
                style={styles.actionButton}
              />
            ) : null}
            {onDone ? (
              <Button
                label={state === 'success' ? 'Continuar' : 'Volver al inicio'}
                variant="ghost"
                onPress={onDone}
                style={styles.actionButton}
              />
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  </Modal>
);
