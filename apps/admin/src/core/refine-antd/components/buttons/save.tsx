import React from "react";
import { Button } from "antd";
import { SaveOutlined } from "@ant-design/icons";

import {
  RefineButtonClassNames,
} from "@/core/refine-types";

import type { SaveButtonProps } from "./types";

export const SaveButton: React.FC<SaveButtonProps> = ({
  children,
  ...rest
}) => {
  return (
    <Button
      type="primary"
      icon={<SaveOutlined />}
      className={RefineButtonClassNames.SaveButton}
      {...rest}
    >
      {children}
    </Button>
  );
};
