import React, { createContext, type PropsWithChildren } from "react";

import App from 'antd/es/app'
import staticNotification from 'antd/es/notification'

export type OpenNotificationParams = {
  key?: string;
  message: string;
  type: "success" | "error";
  description?: string;
};

export interface INotificationContext {
  open?: (params: OpenNotificationParams) => void;
  close?: (key: string) => void;
}

type NotificationProvider = Required<INotificationContext>;

export const NotificationContext = createContext<INotificationContext>({});

export const NotificationContextProvider: React.FC<
  PropsWithChildren<INotificationContext>
> = ({ open, close, children }) => {
  return (
    <NotificationContext.Provider value={{ open, close }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationProvider = (): NotificationProvider => {
  const { notification: notificationFromContext } = App.useApp();

  const notification =
    "open" in notificationFromContext
      ? notificationFromContext
      : staticNotification;

  const notificationProvider: NotificationProvider = {
    open: ({
      key,
      message,
      description,
      type,
    }) => {
      notification.open({
        key,
        description: message,
        message: description ?? null,
        type,
      });
    },
    close: (key) => notification.destroy(key),
  };

  return notificationProvider;
};
