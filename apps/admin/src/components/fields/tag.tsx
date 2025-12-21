import React, { type ReactNode } from "react";
import { Tag } from "antd";
import type { TagProps } from "antd";
import type { RefineFieldCommonProps } from "./_types";

type RefineFieldTagProps<
  TValueType = React.ReactNode,
  TComponentProps extends {} = {},
  TExtraProps extends {} = {},
> = RefineFieldCommonProps<TValueType> & TComponentProps & TExtraProps & {};

type TagFieldProps = RefineFieldTagProps<ReactNode, TagProps>;

/**
 * This field lets you display a value in a tag. It uses Ant Design's {@link https://ant.design/components/tag/ `<Tag>`} component.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/components/fields/tag} for more details.
 */
export const TagField: React.FC<TagFieldProps> = ({ value, ...rest }) => {
  return <Tag {...rest}>{value?.toString()}</Tag>;
};
