import { useCallback, useContext } from "react";
import { NotificationContext, type OpenNotificationParams, type INotificationContext } from "@/providers/notification-provider";

export const useNotification = (): INotificationContext => {
    const { open, close } = useContext(NotificationContext);
    return { open, close };
};

export const useHandleNotification = (): typeof handleNotification => {
    const { open } = useNotification();

    const handleNotification = useCallback(
        (
            notification: OpenNotificationParams | false | undefined
        ) => {
            if (notification) {
                open?.(notification);
            }
        },
        [],
    );

    return handleNotification;
};
