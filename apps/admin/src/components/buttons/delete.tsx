import React from "react";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useResourceParams } from "@refinedev/core";

import type { DeleteButtonProps } from "./types";
import { useDelete } from "../core/use-delete";

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  resource,
  recordItemId,
  onSuccess,
  children,
  successNotification,
  errorNotification,
  hideText = false,
  confirmTitle,
  confirmOkText,
  confirmCancelText,
  invalidates,
  ...rest
}) => {
  const {
    mutation: { mutate, isPending, variables },
  } = useDelete();

  const { id, identifier } = useResourceParams({
    resource,
    id: recordItemId,
  });

  const loading = id === variables?.id && isPending;

  const onConfirm = () => {
    if (!id || !identifier) {
      return;
    }
    mutate(
      {
        id,
        resource: identifier,
        successNotification,
        errorNotification,
        invalidates,
      },
      {
        onSuccess,
      },
    );
  };

  if (rest.hidden) return null;

  return (
    <Popconfirm
      key="delete"
      title={confirmTitle ?? "Вы уверены?"}
      okType="danger"
      okText={confirmOkText ?? "Удалить?"}
      cancelText={confirmCancelText ?? "Отменить"}
      okButtonProps={{ disabled: loading }}
      onConfirm={onConfirm}
      disabled={rest.disabled}
    >
      <Button
        danger
        loading={loading}
        icon={<DeleteOutlined />}
        disabled={rest.disabled}
        {...rest}
      >
        {!hideText && (children ?? "Удалить")}
      </Button>
    </Popconfirm>
  );
};
