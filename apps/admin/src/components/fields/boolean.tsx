import React, { type ReactNode } from "react";

import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import Tooltip from 'antd/es/tooltip'
import type { AbstractTooltipProps } from "antd/lib/tooltip";

import type { RefineFieldCommonProps } from "./_types";

type RefineFieldTooltipProps = {
  children?: React.ReactElement;
  title?: NonNullable<React.ReactNode>;
};

type RefineFieldBooleanProps<
  TValueType = boolean,
  TComponentProps extends {} = {},
  TExtraProps extends {} = {},
> = RefineFieldCommonProps<TValueType> &
  RefineFieldTooltipProps &
  TComponentProps &
  TExtraProps & {
    /**
     * If there is a value, this is the text to use.
     */
    valueLabelTrue?: string;
    /**
     * If there no value, this is the text to use.
     */
    valueLabelFalse?: string;
    /**
     * If there is a value, this is the icon to use.
     */
    trueIcon?: ReactNode;
    /**
     * If there is no value, this is the icon to use.
     */
    falseIcon?: ReactNode;
  };


export type BooleanFieldProps = RefineFieldBooleanProps<
  unknown,
  AbstractTooltipProps
>;

/**
 * This field is used to display boolean values. It uses the {@link https://ant.design/components/tooltip/#header `<Tooltip>`} values from Ant Design.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/components/fields/boolean} for more details.
 */
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
