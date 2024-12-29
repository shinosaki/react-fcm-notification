import { Messaging } from "firebase/messaging"
import { useFcm, UseFcmProps, useNotification } from "../hooks"
import { useCallback } from "react"

export interface NotificationChildrenProps {
  loading: boolean
  isTokenActive: boolean
  toggle: () => Promise<any>
}

export interface NotificationProps extends UseFcmProps {
  children: (props: NotificationChildrenProps) => React.ReactNode
}

export const Notification: React.FC<NotificationProps> = ({
  messaging,
  vapidKey,
  postRequest,
  postRemove,
  children,
}) => {
  const {
    loading: loadingFcm,
    isTokenActive,
    requestToken,
    removeToken,
  } = useFcm({ messaging, vapidKey, postRequest, postRemove })
  const {
    loading: loadingNotification,
    permission,
    requestPermission,
  } = useNotification()

  const loading = loadingFcm || loadingNotification

  const toggle = useCallback(async () => {
    if (permission === 'granted') {
      if (isTokenActive) {
        await removeToken()
      } else {
        await requestToken()
      }
    } else {
      const permission = await requestPermission()
      if (permission === 'granted') {
        await requestToken()
      }
    }
  }, [permission, isTokenActive, requestPermission, requestToken, removeToken])

  return children({ loading, isTokenActive, toggle })
}