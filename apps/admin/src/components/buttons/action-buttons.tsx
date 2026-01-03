import type { MouseEventHandler } from "react";
import { useNavigate } from "@tanstack/react-router";

import Button from "antd/es/button";
import message from "antd/es/message";
import Space from "antd/es/space";
import Divider from "antd/es/divider";

import {
  ToolOutlined,
  CloseOutlined,
  InboxOutlined,
  CheckOutlined,
} from "@ant-design/icons";

import { DeclineButton } from "./decline-button";
import type { ActionButtonProps, ActionButtonsProps } from "./types";

export const actionButtonProps: ActionButtonProps = {
  completed: {
    text: "Завершено",
    color: "green",
    variant: "solid",
    successMessage: "Статус изменен",
    errorMessage: "Ошибка при изменении статуса",
    commentMessage: null,
    icon: <CheckOutlined />,
  },
  approved: {
    text: "Утвердить",
    color: "blue",
    variant: "solid",
    successMessage: "Обращение отправлено в АМО",
    errorMessage: "Не удалось утвердить обращение",
    commentMessage: null,
    icon: <CheckOutlined />,
  },
  archived: {
    text: "Архивировать",
    color: "default",
    variant: "outlined",
    successMessage: "Обращение архивировано",
    errorMessage: "Не удалось архивировать обращение",
    commentMessage: null,
    icon: <InboxOutlined />,
  },
  proceeding: {
    text: "В работу",
    color: "blue",
    variant: "solid",
    successMessage: "Обращение взято в работу",
    errorMessage: "Не удалось изменить статус",
    icon: <ToolOutlined />,
    commentMessage: null,
  },
  declined: {
    text: "Отклонить",
    color: "danger",
    variant: "outlined",
    successMessage: "Обращение отклонено",
    errorMessage: "Не удалось отклоненить предложения",
    commentMessage: "Укажите причину",
    icon: <CloseOutlined />,
  },
  banned: {
    text: "Отклонить",
    color: "danger",
    variant: "outlined",
    successMessage: "Обращение отклонено",
    errorMessage: "Ошибка при отклонении предложения",
    commentMessage: null,
    icon: <CloseOutlined />,
  },
} as const;

export function ActionButtons({
  updateStatus,
  availableActions,
}: ActionButtonsProps) {
  const navigate = useNavigate();

  const availableButtons = availableActions.map((actionObject) => {
    const action = actionObject.action as keyof typeof actionButtonProps;
    const {
      color,
      icon,
      text,
      variant,
      successMessage,
      errorMessage,
      commentMessage,
    } = actionButtonProps[action];

    const handleClick = (
      event: MouseEventHandler<HTMLButtonElement>,
      additionalParams = {},
    ) => {
      updateStatus(
        { values: { ...actionObject.params, ...additionalParams } },
        {
          onSuccess: () => {
            message.success(successMessage);
            setInterval(() => {
              navigate({ reloadDocument: true });
            }, 2000);
          },
          onError: () => {
            message.error(errorMessage);
          },
        },
      );
    };

    if (action === "declined") {
      return (
        <DeclineButton
          color={color}
          variant={variant}
          title={commentMessage ?? ""}
          handleConfirm={handleClick}
          icon={icon ?? null}
        >
          {text}
        </DeclineButton>
      );
    }

    return (
      <Button
        icon={icon ?? null}
        color={color}
        variant={variant}
        onClick={handleClick}
      >
        {text}
      </Button>
    );
  });

  return availableButtons.length ? (
    <>
      <Divider />
      <Space>{availableButtons}</Space>
    </>
  ) : null;
}
