import React from "react";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

import type { EditButtonProps } from "./types";

export const EditButton: React.FC<EditButtonProps> = ({
  hidden,
  disabled,
  children,
  onClick,
  ...rest
}) => {
  if (hidden) return null;

  return (
    <Button
      icon={<EditOutlined />}
      disabled={Boolean(disabled)}
      onClick={(e: React.PointerEvent<HTMLButtonElement>) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        if (onClick) {
          e.preventDefault();
          onClick(e);
        }
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};
