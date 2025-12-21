import React, { type ReactNode } from "react";
import Typography from 'antd/es/typography'
import type { TextProps } from "antd/lib/typography/Text";
import type { RefineFieldCommonProps } from './_types'

function toLocaleStringSupportsOptions() {
  return !!(
    typeof Intl === "object" &&
    Intl &&
    typeof Intl.NumberFormat === "function"
  );
}

type RefineFieldNumberProps<
  TValueType = React.ReactNode,
  TComponentProps extends {} = {},
  TExtraProps extends {} = {},
> = RefineFieldCommonProps<TValueType> &
  TComponentProps &
  TExtraProps & {
    /**
     * Override the browser locale in the date formatting. Passed as first argument to [`Intl.NumberFormat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
     */
    locale?: string | string[];
    /**
     * Number formatting options. Passed as second argument to [`Intl.NumberFormat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
     */
    options?: Intl.NumberFormatOptions;
  };

type NumberFieldProps = RefineFieldNumberProps<ReactNode, TextProps>;


/**
 * This field is used to display a number formatted according to the browser locale, right aligned. and uses {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl `Intl`} to display date format.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/components/fields/number} for more details.
 */
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
