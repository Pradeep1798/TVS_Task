import { useCallback, useEffect, useRef, useState } from 'react';
import { SNACKBAR_DURATION_MS } from 'utils/utils';

export const useSnackbar = (duration: number = SNACKBAR_DURATION_MS) => {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (text: string) => {
      if (timer.current) clearTimeout(timer.current);
      setMessage(text);
      timer.current = setTimeout(() => setMessage(null), duration);
    },
    [duration],
  );

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return { message, show };
};