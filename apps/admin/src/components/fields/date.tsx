import React from "react";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import Typography from "antd/es/typography";

import type { ConfigType } from "dayjs";
import type { TextProps } from "antd/lib/typography/Text";
import type { RefineFieldDateProps } from "./types";

export type DateFieldProps = RefineFieldDateProps<ConfigType, TextProps>;

export const DateField: React.FC<DateFieldProps> = ({
  value,
  locales,
  format: dateFormat = "L",
  ...rest
}) => {
  dayjs.extend(LocalizedFormat);

  const defaultLocale = dayjs.locale();

  return (
    <Typography.Text {...rest}>
      {value
        ? dayjs(value)
            .locale(locales || defaultLocale)
            .format(dateFormat)
        : ""}
    </Typography.Text>
  );
};
