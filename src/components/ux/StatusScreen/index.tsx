import React, { useEffect, useState } from 'react';
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

export interface LoadingStep {
  /** Bar fill for this stage (0–1). */
  progress: number;
  text: string;
}

export interface StatusScreenProps {
  visible: boolean;
  state: StatusState;
  /** Defaults per state when omitted. */
  title?: string;
  message?: string;
  /** Staged copy cycled while loading; overrides `message` in that state. */
  loadingSteps?: LoadingStep[];
  /** Error only: offers a retry action. */
  onRetry?: () => void;
  /** Terminal action. Success auto-fires it; error shows a button. */
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

const DEFAULT_LOADING_STEPS: LoadingStep[] = [
  { progress: 0.25, text: 'Preparando todo…' },
  { progress: 0.55, text: 'Procesando…' },
  { progress: 0.85, text: 'Casi listo…' },
];

/** Cadence for advancing through the loading copy. */
const STEP_INTERVAL_MS = 2200;
/** Success lingers just long enough to celebrate, then auto-closes. */
const SUCCESS_AUTO_DONE_MS = 2600;

/** Full-screen status: circular reveal in the state color, SVG feedback
 *  icon, staged progress and messages. Presentational — the caller
 *  decides the state (e.g. checkout maps payment results). */
export const StatusScreen = ({
  visible,
  state,
  title,
  message,
  loadingSteps = DEFAULT_LOADING_STEPS,
  onRetry,
  onDone,
}: StatusScreenProps) => {
  const [stage, setStage] = useState(0);
  // Settled backdrop color: each state change reveals the new color over it.
  const [settledColor, setSettledColor] = useState<string>(colors.background);

  useEffect(() => {
    if (!visible) {
      setSettledColor(colors.background);
    }
  }, [visible]);

  // Walk the staged copy while loading; reset for the next run.
  useEffect(() => {
    if (!visible || state !== 'loading') {
      setStage(0);
      return;
    }
    const timer = setInterval(
      () => setStage(current => Math.min(current + 1, loadingSteps.length - 1)),
      STEP_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [visible, state, loadingSteps.length]);

  // Success celebrates briefly and leaves on its own — no button.
  useEffect(() => {
    if (!visible || state !== 'success' || !onDone) {
      return;
    }
    const timer = setTimeout(onDone, SUCCESS_AUTO_DONE_MS);
    return () => clearTimeout(timer);
  }, [visible, state, onDone]);

  const loadingStep = loadingSteps[Math.min(stage, loadingSteps.length - 1)];
  const shownMessage = state === 'loading' ? loadingStep?.text : message;

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={() => {}}>
      <View style={[styles.container, { backgroundColor: settledColor }]}>
        <CircularReveal
          key={state}
          color={STATE_COLOR[state]}
          active
          durationMs={550}
          onFinish={() => setSettledColor(STATE_COLOR[state])}
        />
        <View style={styles.content}>
          {state === 'loading' ? (
            <LoadingIcon size={ICON_SIZE} color={colors.onPrimary} />
          ) : state === 'success' ? (
            <DoneIcon size={ICON_SIZE} color={colors.onSuccess} />
          ) : (
            <DeniedIcon size={ICON_SIZE} color={colors.onError} />
          )}
          <Text style={styles.title}>{title ?? DEFAULT_TITLE[state]}</Text>
          {shownMessage ? (
            <Text style={styles.message}>{shownMessage}</Text>
          ) : null}
          {state === 'loading' ? (
            <View style={styles.barWrapper}>
              <ProgressBar
                progress={loadingStep?.progress ?? 0.2}
                color={colors.surface}
                // Gray groove on the colored reveal; white fill grows over it.
                trackColor="rgba(0, 0, 0, 0.18)"
              />
            </View>
          ) : null}
          {state === 'error' ? (
            <View style={styles.actions}>
              {onRetry ? (
                <Button
                  label="Reintentar"
                  variant="ghost"
                  onPress={onRetry}
                  style={styles.actionButton}
                />
              ) : null}
              {onDone ? (
                <Button
                  label="Volver al inicio"
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
};
