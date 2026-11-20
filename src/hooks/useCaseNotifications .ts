import { Case } from 'modals/case';
import { useEffect, useRef } from 'react';
import { logFcmToken, registerListeners, requestNotificationPermission } from 'services/fcm';


export const useCaseNotifications = (onNewCase: (c: Case) => void): void => {
  const handlerRef = useRef(onNewCase);
  useEffect(() => {
    handlerRef.current = onNewCase;
  }, [onNewCase]);

useEffect(() => {
  const init = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      await logFcmToken();
    }
  };
  init();
  return registerListeners((c) => handlerRef.current(c));
}, []);

}