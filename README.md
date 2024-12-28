# react-fcm-notification

`react-fcm-notification` is a React library designed to simplify the implementation of notification features using Firebase Cloud Messaging (FCM). It provides token management and notification permission state management, all accessible as React components.

---

## Features

- **Firebase Cloud Messaging Support**: Simplifies FCM token retrieval and deletion.
- **Notification Permission Management**: Offers hooks for managing browser notification permissions.
- **Customizable**: Allows custom logic integration during token retrieval and deletion.
- **Simple API**: Easy to use yet flexible design.

---

## Installation

```bash
npm install react-fcm-notification
```

---

## Usage

### 1. Firebase Initialization

Create a Firebase project and obtain the required settings. Then initialize the `Messaging` instance from Firebase.

```typescript
// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
```

Alternatively, modularize the initialization as follows:

```typescript
import { FirebaseApp, initializeApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

let app: FirebaseApp;
let messaging: Messaging;

export const fcmEndpointUrl = `https://fcm.googleapis.com/v1/projects/__PROJECT_ID__/messages:send`

export const loadApp = (): FirebaseApp|null => {
  if ('serviceWorker' in navigator) {
    if (!app) {
      app = initializeApp({
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID",
      })
    }
  }

  return app || null
}

export const loadMessaging = (): Messaging|null => {
  if ('serviceWorker' in navigator) {
    if (!messaging) {
      const app = loadApp()
      if (app) {
        messaging = getMessaging(app)
      }
    }
  }

  return messaging || null
}

interface UseFirebase {
  app: FirebaseApp | null
  messaging: Messaging | null
}

export const useFirebase = (): UseFirebase => {
  const app = useMemo(() => loadApp(), [])
  const messaging = useMemo(() => loadMessaging(), [])
  return { app, messaging }
}
```

---

### 2. Using the Component

Use the `Notification` component to implement the notification feature.

```tsx
import React from "react";
import { Notification } from "react-fcm-notification";

const App: React.FC = () => {
  const { messaging } = useFirebase()

  const handleRequest = async ({ token, isTokenActive }: OnRequestProps) => {
    console.log("Token requested:", token, "Active:", isTokenActive);
  };

  const handleRemove = async ({ token, success, isTokenActive }: OnRemoveProps) => {
    console.log("Token removed:", token, "Success:", success, "Active:", isTokenActive);
  };

  if (!messaging) {
    return <p>Your browser does not support notifications.</p>;
  }

  return (
    <Notification
      messaging={messaging}
      vapidKey="YOUR_PUBLIC_VAPID_KEY"
      onRequest={handleRequest}
      onRemove={handleRemove}
    >
      {({ isTokenActive, toggle }) => (
        <div>
          <p>Notifications are currently {isTokenActive ? "enabled" : "disabled"}.</p>
          <button onClick={toggle}>
            {isTokenActive ? "Disable Notifications" : "Enable Notifications"}
          </button>
        </div>
      )}
    </Notification>
  );
};

export default App;
```

---

## API

### `<Notification />`

| Property     | Type                                           | Required | Description                                                                 |
| ------------ | ---------------------------------------------- | -------- | --------------------------------------------------------------------------- |
| `messaging`  | `Messaging`                                    | Required | The Firebase `Messaging` instance.                                          |
| `vapidKey`   | `string`                                       | Required | The VAPID key required to obtain an FCM token.                              |
| `onRequest`  | `(props: OnRequestProps) => Promise<any>`      | Optional | Callback triggered when a token is retrieved.                               |
| `onRemove`   | `(props: OnRemoveProps) => Promise<any>`       | Optional | Callback triggered when a token is removed.                                 |
| `children`   | `({ isTokenActive, toggle }) => React.ReactNode` | Required | A render function receiving the token state and a toggle function.          |

---

### `useFcmToken`

A custom hook for managing FCM tokens.

```typescript
const [isTokenActive, requestToken, removeToken] = useFcmToken({
  messaging,
  vapidKey,
  onRequest,
  onRemove,
});
```

| Return Value   | Type                   | Description                       |
| -------------- | ---------------------- | --------------------------------- |
| `isTokenActive`| `boolean`             | Indicates if the token is active. |
| `requestToken` | `() => Promise<void>` | Function to request a token.      |
| `removeToken`  | `() => Promise<void>` | Function to remove a token.       |

---

### `useNotification`

A custom hook for managing notification permissions.

```typescript
const [permission, setPermission, requestPermission] = useNotification();
```

| Return Value       | Type                                | Description                         |
| ------------------ | ----------------------------------- | ----------------------------------- |
| `permission`       | `NotificationPermission`           | Current notification permission.    |
| `setPermission`    | `Dispatch<SetStateAction<NotificationPermission>>` | Function to set the permission. |
| `requestPermission`| `() => Promise<void>`              | Function to request notification permissions. |

---

## Author
[@shinosaki](https://shinosaki.com)

---

## License

MIT License
