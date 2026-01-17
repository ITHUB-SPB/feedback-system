import React, { type ReactNode } from "react";

import Typography from "antd/es/typography";
import type { TextProps } from "antd/lib/typography/Text";

import type { RefineFieldNumberProps } from "./types";

function toLocaleStringSupportsOptions() {
  return !!(
    typeof Intl === "object" &&
    Intl &&
    typeof Intl.NumberFormat === "function"
  );
}

export type NumberFieldProps = RefineFieldNumberProps<ReactNode, TextProps>;

export const NumberField: React.FC<NumberFieldProps> = ({
  value,
  locale,
  options,
  ...rest
}) => {
  const number = Number(value);

  return (
    <Typography.Text {...rest}>
      {toLocaleStringSupportsOptions()
        ? number.toLocaleString(locale, options)
        : number}
    </Typography.Text>
  );
};
