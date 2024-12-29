import { useCallback, useEffect, useState } from "react"

const getPermission = (): NotificationPermission => {
  return ('Notification' in window)
    ? Notification.permission
    : 'default'
}

export const useNotification = () => {
  const [loading, setLoading] = useState(false)
  const [permission, setPermission] = useState(getPermission)

  useEffect(() => {
    if ('Notification' in window) {
      const updatePermission = () => setPermission(Notification.permission)
      updatePermission()
    }
  }, [])

  const request = useCallback(async () => {
    setLoading(true)

    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)
      return permission
    } catch (e) {
      return 'denied'
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, permission, request }
}