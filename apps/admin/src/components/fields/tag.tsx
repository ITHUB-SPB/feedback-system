import React, { type ReactNode } from "react";
import Tag, { type TagProps } from "antd/es/tag";
import type { RefineFieldTagProps } from "./types";

export type TagFieldProps = RefineFieldTagProps<ReactNode, TagProps>;

export const TagField: React.FC<TagFieldProps> = ({ value, ...rest }) => {
  return <Tag {...rest}>{value?.toString()}</Tag>;
};
