import React from "react";
import Tag from "antd/es/tag";

import type { TagFieldProps } from "./types";

export const TagField: React.FC<TagFieldProps> = ({ value, ...rest }) => {
  return <Tag {...rest}>{value?.toString()}</Tag>;
};
