import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Boolean flag that stays raised for `durationMs` after each trigger —
 * the "added to cart" button feedback pattern. Triggering while raised
 * restarts the window; the pending timer is cleared on unmount.
 */
export const useTimedFlag = (
  durationMs: number,
): [flag: boolean, trigger: () => void] => {
  const [active, setActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  const trigger = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setActive(true);
    timerRef.current = setTimeout(() => setActive(false), durationMs);
  }, [durationMs]);

  return [active, trigger];
};
