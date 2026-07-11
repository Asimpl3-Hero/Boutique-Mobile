import React, { useEffect, useState } from 'react';
import { StatusScreen, type StatusState } from '@components/ux';
import type { RootStackScreenProps } from '@/navigation';

type StatusDemoProps = RootStackScreenProps<'StatusDemo'>;

/**
 * Dev-only showcase of the loader/status system: boots in loading,
 * auto-resolves to success, Continue flips to error, Retry loops back.
 */
export const StatusDemoScreen = ({ navigation }: StatusDemoProps) => {
  const [state, setState] = useState<StatusState>('loading');

  useEffect(() => {
    if (state !== 'loading') {
      return;
    }
    // Long enough to watch the staged loading copy advance.
    const timer = setTimeout(() => setState('success'), 7500);
    return () => clearTimeout(timer);
  }, [state]);

  return (
    <StatusScreen
      visible
      state={state}
      message={
        state === 'loading'
          ? 'Demostración del sistema de estados.'
          : state === 'success'
            ? 'Continuar muestra el estado de error.'
            : 'Reintentar vuelve a cargando; Volver cierra la demo.'
      }
      onRetry={state === 'error' ? () => setState('loading') : undefined}
      onDone={
        state === 'success'
          ? () => setState('error')
          : () => navigation.goBack()
      }
    />
  );
};
