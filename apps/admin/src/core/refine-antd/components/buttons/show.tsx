import React from "react";
import { Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";

import {
  RefineButtonClassNames,
} from "@/core/refine-types";

import type { ShowButtonProps } from "./types";

export const ShowButton: React.FC<ShowButtonProps> = ({
  children,
  disabled,
  hidden,
  ...rest
}) => {
  if (hidden) return null;

  return (
    <Button
      disabled={disabled ?? false}
      hidden={hidden ?? false}
      icon={<EyeOutlined />}
      className={RefineButtonClassNames.ShowButton}
      {...rest}
    >
      {children}
    </Button>
  );
};
