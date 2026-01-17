import React from "react";
import Image, { type ImageProps } from "antd/es/image";

import type { RefineFieldImageProps } from "./types";

export type ImageFieldProps = RefineFieldImageProps<
  string | undefined,
  ImageProps,
  {
    imageTitle?: string;
  }
>;

export const ImageField: React.FC<ImageFieldProps> = ({
  value,
  imageTitle,
  ...rest
}) => {
  return <Image {...rest} src={value} title={imageTitle} />;
};
