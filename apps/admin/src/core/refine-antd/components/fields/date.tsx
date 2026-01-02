import React from "react";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import Typography from "antd/es/typography";

import type { DateFieldProps } from "./types";


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
