import React from "react";
import Image from "antd/es/image";

import type { ImageFieldProps } from "./types";

export const ImageField: React.FC<ImageFieldProps> = ({
  value,
  imageTitle,
  ...rest
}) => {
  return <Image {...rest} src={value} title={imageTitle} />;
};
