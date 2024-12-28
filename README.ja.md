# react-fcm-notification

`react-fcm-notification`は、Firebase Cloud Messaging (FCM) を利用した通知機能を簡単に実装するためのReactライブラリです。このライブラリでは、トークン管理や通知許可の状態管理を提供し、Reactコンポーネントとして活用できます。

---

## 特徴

- **Firebase Cloud Messagingのサポート**: FCMトークンの取得、削除を簡単に管理。
- **通知権限管理**: ブラウザの通知権限を管理するためのフックを提供。
- **カスタマイズ可能**: トークン取得や削除時にカスタムロジックを組み込むことが可能。
- **シンプルなAPI**: 利用が簡単で、柔軟性も高い設計。

---

## インストール

```bash
npm install react-fcm-notification
```

---

## 使用方法

### 1. Firebaseの初期設定

Firebaseプロジェクトを作成し、必要な設定を取得してください。
その後、Firebaseの`Messaging`インスタンスを初期化します。

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

もしくは、以下のようにモジュール化します

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
```

---

### 2. コンポーネントの利用

`Notification`コンポーネントを利用して通知機能を実装します。

```tsx
import React from "react";
import { Notification } from "react-fcm-notification";

const App: React.FC = () => {
  const messaging = loadMessaging()

  const handleRequest = async ({ token, isTokenActive }: OnRequestProps) => {
    console.log("Token requested:", token, "Active:", isTokenActive);
  };

  const handleRemove = async ({ token, success, isTokenActive }: OnRemoveProps) => {
    console.log("Token removed:", token, "Success:", success, "Active:", isTokenActive);
  };

  if (messaging) {
    // Service Workerが利用できない場合など
    return <p>通知に対応していません</p>
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
          <p>通知が{isTokenActive ? "有効" : "無効"}です</p>
          <button onClick={toggle}>
            {isTokenActive ? "通知を無効化する" : "通知を有効化する"}
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

| プロパティ        | 型                         | 必須  | 説明                                                                                           |
| ----------------- | -------------------------- | ----- | ---------------------------------------------------------------------------------------------- |
| `messaging`       | `Messaging`                | 必須  | Firebaseの`Messaging`インスタンス。                                                            |
| `vapidKey`        | `string`                   | 必須  | FCMのトークンを取得する際に必要なVAPIDキー。                                                   |
| `onRequest`       | `(props: OnRequestProps) => Promise<any>` | 任意  | トークン取得時のコールバック。                                                                 |
| `onRemove`        | `(props: OnRemoveProps) => Promise<any>`  | 任意  | トークン削除時のコールバック。                                                                 |
| `children`        | `({ isTokenActive, toggle }) => React.ReactNode` | 必須  | 子コンポーネントの関数。トークンの状態と切り替え関数を受け取ります。                           |

---

### `useFcmToken`

FCMトークンを管理するためのカスタムフック。

```typescript
const [isTokenActive, requestToken, removeToken] = useFcmToken({
    messaging,
    vapidKey,
    onRequest,
    onRemove,
});
```

| 戻り値              | 型               | 説明                     |
| ------------------- | ---------------- | ------------------------ |
| `isTokenActive`     | `boolean`        | トークンが有効かどうか。 |
| `requestToken`      | `() => Promise<void>` | トークンをリクエストする関数。 |
| `removeToken`       | `() => Promise<void>` | トークンを削除する関数。 |

---

### `useNotification`

通知権限を管理するためのカスタムフック。

```typescript
const [permission, setPermission, requestPermission] = useNotification();
```

| 戻り値              | 型                              | 説明                      |
| ------------------- | ------------------------------- | ------------------------- |
| `permission`        | `NotificationPermission`        | 現在の通知権限。          |
| `setPermission`     | `Dispatch<SetStateAction<NotificationPermission>>` | 権限を直接設定する関数。 |
| `requestPermission` | `() => Promise<void>`           | 通知権限をリクエストする関数。 |

---

## 作者
[@shinosaki](https://shinosaki.com)

---

## ライセンス

MIT License