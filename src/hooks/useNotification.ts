import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type UseNotification = [
    NotificationPermission,
    Dispatch<SetStateAction<NotificationPermission>>,
    () => Promise<void>
]

export const useNotification = (): UseNotification => {
    const [permission, setPermission] = useState(
        () => (('Notification' in window) ? Notification.permission : 'default')
    )

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission)
        }
    }, [])

    const requestPermission = async ()=> {
        return Notification.requestPermission().then(setPermission)
    }

    return [permission, setPermission, requestPermission]
}