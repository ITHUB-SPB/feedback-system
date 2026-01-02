import { useCallback, useState } from "react";

import get from "lodash/get";

import type { SelectProps } from "antd/lib/select";

import {
  type BaseRecord,
  type BaseOption,
} from "@refinedev/core";

export type UseSelectFromQueryProps<TData> = {
  data: TData[],
  optionLabel?:
  | (keyof TData extends string ? keyof TData : never)
  | ((item: TData) => string);
  /**
   * Set the option's value
   * @default `"id"`
   */
  optionValue?:
  | (keyof TData extends string ? keyof TData : never)
  | ((item: TData) => string);
};


export type UseSelectFromQueryReturnType<
  TOption extends BaseOption = BaseOption,
> = {
  selectProps: SelectProps<TOption>;
};

export const useSelectFromQuery = <
  TData extends BaseRecord,
  TOption extends BaseOption = BaseOption,
>(props: UseSelectFromQueryProps<TData>)
  : UseSelectFromQueryReturnType<TOption> => {

  const {
    data,
    optionLabel = "title",
    optionValue = "id",
  } = props;

  const getOptionLabel = useCallback(
    (item: TData) => {
      if (typeof optionLabel === "string") {
        return get(item, optionLabel);
      }

      return optionLabel(item);
    },
    [optionLabel],
  );

  const getOptionValue = useCallback(
    (item: TData) => {
      if (typeof optionValue === "string") {
        return get(item, optionValue);
      }

      return optionValue(item);
    },
    [optionValue],
  );


  return {
    selectProps: {
      options: data.map(
        (item) =>
          ({
            label: getOptionLabel(item),
            value: getOptionValue(item),
          }) as TOption,
      ),
      onSearch: undefined,
      filterOption: true,
      optionFilterProp: "label"
    },
  };
};
