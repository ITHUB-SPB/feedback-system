import React from "react";
import Typography from "antd/es/typography";

import type { TextFieldProps } from "./types";

export const TextField: React.FC<TextFieldProps> = ({ value, ...rest }) => {
  return <Typography.Text {...rest}>{value}</Typography.Text>;
};
