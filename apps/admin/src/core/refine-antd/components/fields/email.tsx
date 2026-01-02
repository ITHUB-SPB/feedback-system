import React from "react";
import Typography from "antd/es/typography";

import type { EmailFieldProps } from "./types";

export const EmailField: React.FC<EmailFieldProps> = ({ value, ...rest }) => {
  return (
    <Typography.Link href={`mailto:${value}`} {...rest}>
      {value}
    </Typography.Link>
  );
};
