import type { onMessage } from '@react-native-firebase/messaging';

type OnMessageListener = Parameters<typeof onMessage>[1];

export type RemoteMessage = Parameters<OnMessageListener>[0];

export interface FcmCasePayload {
  id: string;
  title: string;
  body: string;
}