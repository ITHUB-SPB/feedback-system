import React from "react";
import Typography from "antd/es/typography";
import dayjs, { type ConfigType } from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import type { TextProps } from "antd/lib/typography/Text";

import type { RefineFieldCommonProps } from "./_types";

type RefineFieldDateProps<
  TValueType = ConfigType,
  TComponentProps extends {} = {},
  TExtraProps extends {} = {},
> = RefineFieldCommonProps<TValueType> &
  TComponentProps &
  TExtraProps & {
    /**
     * The locales of the date.
     * By default, Day.js comes with English locale only. If you need other locales, you can load them on demand.
     * [Refer to loading locales](https://day.js.org/docs/en/i18n/loading-into-browser)
     * @default English
     */
    locales?: string;
    /**
     * Gets the formatted date according to the string of the tokens passed in.
     */
    format?: string;
  };

type DateFieldProps = RefineFieldDateProps<ConfigType, TextProps>;

/**
 * This field is used to display dates. It uses {@link https://day.js.org/docs/en/display/format `Day.js`} to display date format.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/components/fields/date} for more details.
 */
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
