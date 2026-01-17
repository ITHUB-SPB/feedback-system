import React, { type ReactNode } from "react";
import Typography from "antd/es/typography";

import type { LinkProps } from "antd/lib/typography/Link";
import type { RefineFieldEmailProps } from "./types";

export type EmailFieldProps = RefineFieldEmailProps<ReactNode, LinkProps>;

export const EmailField: React.FC<EmailFieldProps> = ({ value, ...rest }) => {
  return (
    <Typography.Link href={`mailto:${value}`} {...rest}>
      {value}
    </Typography.Link>
  );
};
