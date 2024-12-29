import { deleteToken, getToken, Messaging } from "firebase/messaging"
import { useCallback, useState } from "react"

const LS = {
  getTokenState: (key = 'token_state', initValue = 'false') => {
    const value = localStorage.getItem(key) ?? initValue
    return Boolean(JSON.parse(value))
  },
  setTokenState: (state: boolean, key = 'token_state') => {
    localStorage.setItem(key, JSON.stringify(state))
    return state
  },
}

export interface UseFcmProps {
  messaging: Messaging
  vapidKey: string
  postRequest?: (token: string) => any
  postRemove?: (token: string) => any
}

export const useFcm = ({ messaging, vapidKey, postRequest, postRemove }: UseFcmProps) => {
  const [loading, setLoading] = useState(false)
  const [isTokenActive, setIsTokenActive] = useState(LS.getTokenState())

  const requestToken = useCallback(async () => {
    setLoading(true)

    try {
      const token = await getToken(messaging, { vapidKey })

      setIsTokenActive(!!token)
      LS.setTokenState(!!token)

      if (token) {
        await postRequest?.(token)
      }
    } finally {
      setLoading(false)
    }
  }, [messaging, vapidKey])

  const removeToken = useCallback(async () => {
    setLoading(true)

    try {
      const token = await getToken(messaging, { vapidKey })
      const isDeleteSuccess = await deleteToken(messaging)

      setIsTokenActive(!isDeleteSuccess)
      LS.setTokenState(!isDeleteSuccess)

      if (isDeleteSuccess && token) {
        await postRemove?.(token)
      }
    } finally {
      setLoading(false)
    }
  }, [messaging, vapidKey])

  return { loading, isTokenActive, requestToken, removeToken }
}