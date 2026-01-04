import React from "react";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { useDeleteButton } from "@refinedev/core";

import type { DeleteButtonProps } from "./types";

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  resource,
  recordItemId,
  onSuccess,
  mutationMode,
  children,
  successNotification,
  errorNotification,
  hideText = false,
  meta,
  dataProviderName,
  confirmTitle,
  confirmOkText,
  confirmCancelText,
  invalidates,
  ...rest
}) => {
  const { title, hidden, disabled, loading, onConfirm } = useDeleteButton({
    resource,
    id: recordItemId,
    dataProviderName,
    invalidates,
    meta,
    onSuccess,
    mutationMode,
    errorNotification,
    successNotification,
  });

  const isDisabled = disabled || rest.disabled;
  const isHidden = hidden || rest.hidden;

  if (isHidden) return null;

  return (
    <Popconfirm
      key="delete"
      title={confirmTitle ?? "Вы уверены?"}
      okType="danger"
      okText={confirmOkText ?? "Удалить?"}
      cancelText={confirmCancelText ?? "Отменить"}
      okButtonProps={{ disabled: loading }}
      onConfirm={onConfirm}
      disabled={isDisabled}
    >
      <Button
        danger
        loading={loading}
        icon={<DeleteOutlined />}
        title={title}
        disabled={isDisabled}
        {...rest}
      >
        {!hideText && (children ?? "Удалить")}
      </Button>
    </Popconfirm>
  );
};
