import { AppRegistry } from 'react-native';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import { NotificationSource } from 'utils/utils';
import { processMessage } from 'services/fcm';
import { waitForRehydrate } from 'store';

setBackgroundMessageHandler(getMessaging(), async msg => {
  await waitForRehydrate();
  processMessage(msg, NotificationSource.Background);
});

AppRegistry.registerComponent(appName, () => App);
