import React from "react";
import { Button } from "antd";
import { ExportOutlined } from "@ant-design/icons";

import type { ExportButtonProps } from "./types";

export const ExportButton: React.FC<ExportButtonProps> = ({
  children,
  ...rest
}) => {
  return (
    <Button type="default" icon={<ExportOutlined />} {...rest}>
      {children}
    </Button>
  );
};
