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

/**
 * This field lets you show basic text. It uses Ant Design's {@link https://ant.design/components/typography/#Typography.Text `<Typography.Text>`} component.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/components/fields/text} for more details.
 */
export const TextField: React.FC<TextFieldProps> = ({ value, ...rest }) => {
  return <Typography.Text {...rest}>{value}</Typography.Text>;
};
