import { useState } from 'react'
import { deleteToken, getToken, Messaging } from 'firebase/messaging'

export interface OnRequestProps {
    token: string
    isTokenActive: boolean
}

export interface OnRemoveProps {
    token: string|null
    success: boolean
    isTokenActive: boolean
}

export interface UseFcmTokenProps {
    messaging: Messaging
    vapidKey: string
    lsKey?: string
    onRequest?: (props: OnRequestProps) => Promise<any>
    onRemove?: (props: OnRemoveProps) => Promise<any>
}

export type UseFcmToken = [
    boolean,
    () => Promise<void>,
    () => Promise<void>,
]

export const useFcmToken = ({
    messaging,
    vapidKey,
    lsKey = 'isTokenActive',
    onRequest,
    onRemove,
}: UseFcmTokenProps): UseFcmToken => {
    const [token, setToken] = useState<string|null>(null)
    const [isTokenActive, setIsTokenActive] = useState<boolean>(
        () => !!JSON.parse(localStorage.getItem(lsKey) ?? 'false')
    )

    const requestToken = async () => {
        const token = await getToken(messaging, { vapidKey })

        setToken(token)
        setIsTokenActive(!!token)

        localStorage.setItem(lsKey, JSON.stringify(!!token))

        onRequest?.({ token, isTokenActive })
    }

    const removeToken = async () => {
        const success = await deleteToken(messaging)
        console.log('removetoken', success)

        setIsTokenActive(!success)
        localStorage.setItem(lsKey, JSON.stringify(!success))

        onRemove?.({ token, success, isTokenActive })
    }

    return [isTokenActive, requestToken, removeToken]
}