# Cases App: FCM Notification & Dynamic List Update

React Native (TypeScript) app that receives Firebase Cloud Messaging (FCM) notifications and adds each one to a list of cases in real time, newest first, with no duplicates.

## Tech stack
- React Native CLI, TypeScript
- `@react-native-firebase/app` and `messaging` (FCM)
- Redux Toolkit, React Redux, redux-persist (AsyncStorage)

## Features
- Cases list rendered with `FlatList` (`ListView` is deprecated)
- New case from FCM appears at the top without refreshing
- Foreground, background and killed states handled
- Duplicate cases are ignored (checked by `id`)
- Snackbar shown when a case arrives in the foreground
- Cases persist across app restarts

## FCM payload
```json
{ "title": "New Case Received", "body": "A new service case has been assigned", "id": "CASE1005" }
```
Sent as custom data. A message without an `id` is ignored.

## Approach

**State management:** a Redux Toolkit slice holds `items: Case[]`. The `caseAdded` reducer prepends the case with `unshift`, so the newest is on top. A thunk, `receiveCase`, checks for an existing `id` and returns `true` if the case was added or `false` if it was a duplicate. The foreground handler uses that result to decide whether to show the snackbar. The reducer repeats the check as a safety net.

**Notification handling** (`src/services/fcm.service.ts`):
- **Foreground:** `onMessage` adds the case and shows the snackbar. FCM shows no system notification in this state.
- **Background:** `setBackgroundMessageHandler` is registered in `index.js`, outside any component, and adds the case.
- **Background, notification tapped:** `onNotificationOpenedApp` adds the case.
- **Killed, notification tapped:** `getInitialNotification` runs on startup and adds the case.

All paths go through one function, `processMessage`, so validation and de-duplication live in one place.

**Persistence:** the background handler runs in a headless JS context with an empty store, so it waits for redux-persist to rehydrate (`waitForRehydrate`) before adding a case. Without this, old cases would be overwritten.

**TypeScript:** typed models (`Case`, `FcmCasePayload`), enums (`NotificationSource`, `StorageKey`), typed hooks, and a type guard that validates the untyped FCM `data` payload before use.

**Permissions:** `POST_NOTIFICATIONS` is requested at runtime on Android 13+, and the FCM token is logged for testing.

## Project structure
```
index.js                      background handler
App.tsx                       Provider + PersistGate
src/
  constants/  enums/  models/  utils/
  store/      casesSlice, store, typed hooks
  services/   fcm.service
  hooks/      useSnackbar, useCaseNotifications
  components/ CaseCard, Snackbar
  screens/    CasesScreen
```

## Setup
1. `npm install`
2. Create a Firebase project and add an Android app with the package name from `android/app/build.gradle`.
3. Put `google-services.json` in `android/app/`.
4. `npx react-native run-android`
5. Allow notifications and copy the `FCM token:` line from the Metro logs.

## Testing
In the Firebase console, create a campaign targeting the app, add custom data (`id`, `title`, `body`) and send it. Checked:
- App open: case appears at the top and the snackbar shows
- App in background: case is added after tapping the notification
- App killed: case is added after tapping the notification
- Same `id` sent twice: only one card
- Restart: cases are still there

## Notes
- Tested on Android only. iOS needs an APNs key, which was out of scope.
- The Firebase console always sends a `notification` block. In the background, Android then shows the notification itself and the case is added when the user taps it. A data-only message sent through the FCM HTTP v1 API would add the case without a tap, and is the recommended approach for production.