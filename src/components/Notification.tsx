import { useEffect } from "react"
import { Messaging } from "firebase/messaging"
import { OnRemoveProps, OnRequestProps, useFcmToken } from "../hooks/useFcm"
import { useNotification } from "../hooks/useNotification"

interface NotificationProps {
    messaging: Messaging,
    vapidKey: string,
    onRequest?: (props: OnRequestProps) => Promise<any>
    onRemove?: (props: OnRemoveProps) => Promise<any>
    children: (props: NotificationChildrenProps) => React.ReactNode|Promise<React.ReactNode>,
}

interface NotificationChildrenProps {
    isTokenActive: boolean
    toggle: () => Promise<void>
}

export const Notification: React.FC<NotificationProps> = ({
    messaging,
    vapidKey,
    onRequest,
    onRemove,
    children,
}) => {
    const [isTokenActive, requestToken, removeToken] = useFcmToken({
        messaging,
        vapidKey,
        onRequest,
        onRemove,
    })
    const [permission, _, requestPermission] = useNotification()

    useEffect(() => {
        if (permission === 'granted' && isTokenActive) {
            requestToken()
        }
    }, [permission, isTokenActive, requestToken])

    const toggle = async () => {
        if (permission !== 'granted') {
            await requestPermission()
        }

        if (isTokenActive) {
            await removeToken()
        } else {
            await requestToken()
        }
    }

    return children({ isTokenActive, toggle })
}