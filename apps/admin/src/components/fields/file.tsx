import React from "react";

import type { LinkProps } from "antd/lib/typography/Link";

import { UrlField } from "./url";
import type { RefineFieldFileProps } from "./types";

export type FileFieldProps = RefineFieldFileProps<LinkProps>;

export const FileField: React.FC<FileFieldProps> = ({
  title,
  src,
  ...rest
}) => {
  return (
    <UrlField value={src} title={title} {...rest}>
      {title ?? src}
    </UrlField>
  );
};
