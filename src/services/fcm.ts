import {
  AuthorizationStatus,
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  requestPermission,
} from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import { NotificationSource } from 'utils/utils';
import { Case } from 'modals/case';
import { RemoteMessage } from 'modals/fcm';
import { store } from 'store';
import { receiveCase } from 'store/caseSlice';
import { mapRemoteMessageToCase } from 'utils/utils';

export const processMessage = (
  msg: RemoteMessage,
  source: NotificationSource,
): Case | null => {
  const newCase = mapRemoteMessageToCase(msg, source);
  if (!newCase) return null;
  return store.dispatch(receiveCase(newCase)) ? newCase : null;
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      if (Platform.Version < 33) return true;
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return res === PermissionsAndroid.RESULTS.GRANTED;
    }
    const status = await requestPermission(getMessaging());
    return (
      status === AuthorizationStatus.AUTHORIZED ||
      status === AuthorizationStatus.PROVISIONAL
    );
  } catch (e) {
    console.warn('Notification permission failed', e);
    return false;
  }
};

export const logFcmToken = async (): Promise<void> => {
  try {
    console.log('FCM token:', await getToken(getMessaging()));
  } catch (e) {
    console.warn('FCM getToken failed', e);
  }
};

export const registerListeners = (onNewCase: (c: Case) => void): (() => void) => {
  const messaging = getMessaging();

  const offForeground = onMessage(messaging, async (msg) => {
    const added = processMessage(msg, NotificationSource.Foreground);
    if (added) onNewCase(added);
  });

  const offOpened = onNotificationOpenedApp(messaging, (msg) => {
    processMessage(msg, NotificationSource.Background);
  });

  const offToken = onTokenRefresh(messaging, (t) =>
    console.log('FCM token refreshed:', t),
  );

  getInitialNotification(messaging)
    .then((msg) => {
      if (msg) processMessage(msg, NotificationSource.Quit);
    })
    .catch((e) => console.warn('getInitialNotification failed', e));

  return () => {
    offForeground();
    offOpened();
    offToken();
  };
};