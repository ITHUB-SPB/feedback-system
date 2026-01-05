import React from "react";
import { Tooltip } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

import type { AbstractTooltipProps } from "antd/lib/tooltip";
import type { RefineFieldBooleanProps } from "./types";

export type BooleanFieldProps = RefineFieldBooleanProps<
  unknown,
  AbstractTooltipProps
>;

export const BooleanField: React.FC<BooleanFieldProps> = ({
  value,
  valueLabelTrue = "true",
  valueLabelFalse = "false",
  trueIcon = <CheckOutlined />,
  falseIcon = <CloseOutlined />,
  ...rest
}) => {
  return (
    <Tooltip title={value ? valueLabelTrue : valueLabelFalse} {...rest}>
      {value ? <span>{trueIcon}</span> : <span>{falseIcon}</span>}
    </Tooltip>
  );
};
