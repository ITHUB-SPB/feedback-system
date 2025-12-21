import React, { type ReactNode } from "react";
import Typography from 'antd/es/typography'
import type { TextProps } from "antd/lib/typography/Text";
import type { RefineFieldCommonProps } from "./_types";

type RefineFieldTextProps<
  TValueType = React.ReactNode,
  TComponentProps extends {} = {},
  TExtraProps extends {} = {},
> = RefineFieldCommonProps<TValueType> & TComponentProps & TExtraProps & {};

type TextFieldProps = RefineFieldTextProps<ReactNode, TextProps>;

export const TextField: React.FC<TextFieldProps> = ({ value, ...rest }) => {
  return <Typography.Text {...rest}>{value}</Typography.Text>;
};
