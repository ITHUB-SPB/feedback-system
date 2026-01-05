import React from "react";

import Button from 'antd/es/button'
import Progress from 'antd/es/progress'
import App from 'antd/es/app'
import staticNotification from 'antd/es/notification'
import { UndoOutlined } from "@ant-design/icons";

import type { NotificationProvider } from "@refinedev/core";

export type OpenNotificationParams = {
  key?: string;
  message: string;
  type: "success" | "error" | "progress";
  description?: string;
  cancelMutation?: () => void;
  undoableTimeout?: number;
};

export type UndoableNotificationProps = {
  notificationKey: OpenNotificationParams["key"];
  message: OpenNotificationParams["message"];
  cancelMutation: OpenNotificationParams["cancelMutation"];
  undoableTimeout: OpenNotificationParams["undoableTimeout"];
};

export const UndoableNotification: React.FC<UndoableNotificationProps> = ({
  message,
  cancelMutation,
  undoableTimeout,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "-7px",
    }}
  >
    <Progress
      type="circle"
      percent={(undoableTimeout ?? 0) * 20}
      format={(time) => time && time / 20}
      size={50}
      strokeColor="#1890ff"
      status="normal"
    />
    <span style={{ marginLeft: 8, width: "100%" }}>{message}</span>
    <Button
      style={{ flexShrink: 0 }}
      onClick={cancelMutation}
      disabled={undoableTimeout === 0}
      icon={<UndoOutlined />}
    />
  </div>
);


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
      cancelMutation,
      undoableTimeout,
    }) => {
      if (type === "progress") {
        notification.open({
          key,
          description: (
            <UndoableNotification
              notificationKey={key}
              message={message}
              cancelMutation={() => {
                cancelMutation?.();
                notification.destroy(key ?? "");
              }}
              undoableTimeout={undoableTimeout}
            />
          ),
          message: null,
          duration: 0,
          closeIcon: <></>,
        });
      } else {
        notification.open({
          key,
          description: message,
          message: description ?? null,
          type,
        });
      }
    },
    close: (key) => notification.destroy(key),
  };

  return notificationProvider;
};
