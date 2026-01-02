import React from "react";
import { Button } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";

import {
  RefineButtonClassNames,
} from "@/core/refine-types";

import type { CreateButtonProps } from "./types";

export const CreateButton: React.FC<CreateButtonProps> = ({
  children,
  onClick,
  disabled,
  hidden,
  ...rest
}) => {

  if (hidden) return null;

  return (
    <Button
      icon={<PlusSquareOutlined />}
      disabled={Boolean(disabled)}
      className={RefineButtonClassNames.CreateButton}
      type="primary"
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
