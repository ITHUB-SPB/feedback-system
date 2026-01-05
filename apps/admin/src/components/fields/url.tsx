import React from "react";

import Typography from "antd/es/typography";
import type { LinkProps } from "antd/lib/typography/Link";

import type {
  RefineFieldUrlProps
} from "./types";

export type UrlFieldProps = RefineFieldUrlProps<string | undefined, LinkProps>;

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
