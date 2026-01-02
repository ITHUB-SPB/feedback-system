import React from "react";
import Typography from "antd/es/typography";

import type { UrlFieldProps } from "./types";

export const UrlField: React.FC<UrlFieldProps> = ({
  children,
  value,
  ...rest
}) => {
  return (
    <Typography.Link href={value} {...rest}>
      {children ?? value}
    </Typography.Link>
  );
};
