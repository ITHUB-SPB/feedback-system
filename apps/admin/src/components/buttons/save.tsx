import React from "react";
import { Button } from "antd";
import { SaveOutlined } from "@ant-design/icons";

import type { SaveButtonProps } from "./types";

export const SaveButton: React.FC<SaveButtonProps> = ({
  children,
  hideText,
  ...rest
}) => {
  return (
    <Button type="primary" icon={<SaveOutlined />} {...rest}>
      {!hideText && (children ?? "Сохранить")}
    </Button>
  );
};
