import React from "react";
import { Button } from "antd";
import { BarsOutlined } from "@ant-design/icons";

import {
  RefineButtonClassNames,
} from "@/core/refine-types";

import type { ListButtonProps } from "./types";

export const ListButton: React.FC<ListButtonProps> = ({
  children,
  disabled,
  hidden,
  onClick,
  ...rest
}) => {
  if (hidden) return null;

  return (
    <Button
      icon={<BarsOutlined />}
      disabled={Boolean(disabled)}
      className={RefineButtonClassNames.ListButton}
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
