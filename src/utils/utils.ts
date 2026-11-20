import { Case } from "modals/case";
import { FcmCasePayload, RemoteMessage } from "modals/fcm";


export enum NotificationSource {
  Foreground = 'foreground',
  Background = 'background',
  Quit = 'quit',
}

export enum StorageKey {
  Root = 'root',
}

export const SNACKBAR_DURATION_MS = 3000;
export const DEFAULT_CASE_TITLE = 'New Case';


const isNonEmptyString = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0;

const parsePayload = (msg: RemoteMessage): FcmCasePayload | null => {
  const data: Record<string, unknown> = msg.data ?? {};
  if (!isNonEmptyString(data.id)) return null;

  return {
    id: data.id.trim(),
    title: isNonEmptyString(data.title)
      ? data.title
      : msg.notification?.title ?? DEFAULT_CASE_TITLE,
    body: isNonEmptyString(data.body) ? data.body : msg.notification?.body ?? '',
  };
};

export const mapRemoteMessageToCase = (
  msg: RemoteMessage,
  source: NotificationSource,
): Case | null => {
  const payload = parsePayload(msg);
  return payload ? { ...payload, receivedAt: Date.now(), source } : null;
};

export const formatReceivedTime = (ts: number): string =>
  new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });