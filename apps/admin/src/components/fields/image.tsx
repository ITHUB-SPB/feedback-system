import React from "react";
import type { ImageProps } from "antd";
import Image from "antd/es/image";
import type { RefineFieldCommonProps } from "./_types";

type RefineFieldImageProps<
  TValueType = string | undefined,
  TComponentProps extends {} = {},
  TExtraProps extends {} = {},
> = RefineFieldCommonProps<TValueType> & TComponentProps & TExtraProps & {};

type ImageFieldProps = RefineFieldImageProps<
  string | undefined,
  ImageProps,
  {
    imageTitle?: string;
  }
>;

/**
 * This field is used to display images and uses {@link https://ant.design/components/image/#header `<Image>`} from Ant Design.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/components/fields/image} for more details.
 */
export const ImageField: React.FC<ImageFieldProps> = ({
  value,
  imageTitle,
  ...rest
}) => {
  return <Image {...rest} src={value} title={imageTitle} />;
};
