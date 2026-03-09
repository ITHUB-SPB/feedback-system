import React, { useState, useCallback } from "react";

import type {
  QueryObserverResult,
  UseQueryOptions,
} from "@tanstack/react-query";

import type { TablePaginationConfig, TableProps } from "antd/es/table";

import differenceWith from "lodash/differenceWith";
import unionWith from "lodash/unionWith";

import {
  type BaseRecord,
  type HttpError,
  type LogicalFilter as CrudFilter,
  type CrudSort,
  type GetListResponse,
  type Prettify,
  type SuccessErrorNotification,
  type UseLoadingOvertimeOptionsProps,
  type UseLoadingOvertimeReturnType,
  type CrudOperators,
} from "@refinedev/core";

import { useListFromQuery } from "../core/use-list-from-query";

export type BaseListProps = {
  sorters?: CrudSort[];
  filters?: CrudFilter[];
};

export type useTableFromQueryProps<TQueryFnData, TError, TData> = {
  sorters?: {
    /**
     * Initial sorter state
     */
    initial?: CrudSort[];
    /**
     * Default and unchangeable sorter state
     *  @default `[]`
     */
    permanent?: CrudSort[];
    /**
     * Whether to use server side sorting or not.
     * @default "server"
     */
    mode?: "server" | "off";
  };

  filters?: {
    /**
     * Initial filter state
     */
    initial?: CrudFilter[];
    /**
     * Default and unchangeable filter state
     *  @default `[]`
     */
    permanent?: CrudFilter[];
    /**
     * Whether to use server side filter or not.
     * @default "server"
     */
    mode?: "server" | "off";
  };
  /**
   * react-query's [useQuery](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery) options
   */
  queryOptions: ({
    filters,
    sorters,
  }: {
    filters?: CrudFilter[] | undefined;
    sorters?: CrudSort[] | undefined;
  }) => UseQueryOptions<
    GetListResponse<TQueryFnData>,
    TError,
    GetListResponse<TData>
  >;
} & SuccessErrorNotification<
  GetListResponse<TData>,
  TError,
  Prettify<BaseListProps>
> &
  UseLoadingOvertimeOptionsProps;

export type useTableFromQueryReturnType<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
> = {
  tableQuery: QueryObserverResult<GetListResponse<TData>, TError>;
  sorters: CrudSort[];
  setSorters: (sorter: CrudSort[]) => void;
  filters: CrudFilter[];
  setFilters: ((filters: CrudFilter[]) => void) &
  ((setter: (prevFilters: CrudFilter[]) => CrudFilter[]) => void);
  result: {
    data: TData[];
    total: number | undefined;
  };
} & UseLoadingOvertimeReturnType & {
  tableProps: TableProps<TData>;
};

export type FilterValue = Parameters<
  NonNullable<TableProps["onChange"]>
>[1][string];

export type SortOrder = NonNullable<TableProps["sortDirections"]>[number];

export type SorterResult = Exclude<
  Parameters<NonNullable<TableProps["onChange"]>>[2],
  any[]
>;

export const unionFilters = (
  permanentFilter: CrudFilter[],
  newFilters: CrudFilter[],
  prevFilters: CrudFilter[] = [],
): CrudFilter[] => unionWith(
  permanentFilter,
  newFilters,
  prevFilters,
  compareFilters,
).filter(
  (crudFilter) => crudFilter.value !== undefined && crudFilter.value !== null
)

export const unionSorters = (
  permanentSorter: CrudSort[],
  newSorters: CrudSort[],
): CrudSort[] => unionWith(
  permanentSorter,
  newSorters,
  compareSorters
).filter(
  (crudSorter) => crudSorter.order !== undefined && crudSorter.order !== null
);


export const compareFilters = (
  left: CrudFilter,
  right: CrudFilter,
): boolean => {
  return (
    ("field" in left ? left.field : undefined) ===
    ("field" in right ? right.field : undefined) &&
    left.operator === right.operator
  );
};

export const compareSorters = (left: CrudSort, right: CrudSort): boolean =>
  left.field === right.field;


// Prioritize filters in the permanentFilter and put it at the end of result array
export const setInitialFilters = (
  permanentFilter: CrudFilter[],
  defaultFilter: CrudFilter[],
): CrudFilter[] => [
    ...differenceWith(defaultFilter, permanentFilter, compareFilters),
    ...permanentFilter,
  ];

export const setInitialSorters = (
  permanentSorter: CrudSort[],
  defaultSorter: CrudSort[],
): CrudSort[] => [
    ...differenceWith(defaultSorter, permanentSorter, compareSorters),
    ...permanentSorter,
  ];


export const getDefaultSortOrder = (
  columnName: string,
  sorter?: CrudSort[],
): SortOrder | undefined => {
  if (!sorter) {
    return undefined;
  }

  const sortItem = sorter.find((item) => item.field === columnName);
  const sort = sortItem?.order ?? undefined;

  return sort ? `${sort}end` : undefined
};

export const getDefaultFilter = (
  columnName: string,
  filters?: CrudFilter[],
  operatorType: Exclude<CrudOperators, "or" | "and"> = "eq",
): CrudFilter["value"] | undefined => {
  const filter = filters?.find((filter) => {
    return filter.field === columnName && filter.operator === operatorType;
  });

  if (filter) {
    return filter.value || [];
  }

  return undefined;
};

export const mapAntdSorterToCrudSorting = (
  sorter: SorterResult | SorterResult[],
): CrudSort[] => {
  if (Array.isArray(sorter)) {
    return sorter
      .sort((a, b) => {
        return ((a.column?.sorter as { multiple?: number }).multiple ?? 0) <
          ((b.column?.sorter as { multiple?: number }).multiple ?? 0)
          ? -1
          : 0;
      })
      .filter(item => item.field && item.order)
      .map((item) => {
        const field = Array.isArray(item.field)
          ? item.field.join(".")
          : `${item.field}`;

        const order = item.order?.replace("end", "") || "asc"

        return {
          field: `${item.columnKey ?? field}`,
          order: order as "asc" | "desc",
        }
      });
  }

  if (!sorter.field || !sorter.order) {
    return []
  }

  const field = Array.isArray(sorter.field)
    ? sorter.field.join(".")
    : sorter.field;

  return [
    {
      field: `${sorter.columnKey ?? field}`,
      order: sorter.order.replace("end", "") as "asc" | "desc",

    }
  ]
};

export const mapAntdFilterToCrudFilter = (
  tableFilters: Record<
    string,
    | FilterValue
    | (string | number | boolean)
    | (string | number | boolean)[]
    | null
  >,
  prevFilters: CrudFilter[],
  initialFilters?: CrudFilter[],
): CrudFilter[] => {

  const crudFilters: CrudFilter[] = [];

  const mapInitialFilter: Record<string, CrudFilter> = (
    initialFilters ?? []
  ).reduce((acc, item) => {
    const field = item.field;
    return { ...acc, [field]: item };
  }, {});

  Object.keys(tableFilters).map((field) => {
    const value = tableFilters[field];

    const operator =
      prevFilters.find((p: any) => p.field === field)?.operator ||
      mapInitialFilter[field]?.operator;

    crudFilters.push({
      field,
      operator: operator ?? (Array.isArray(value) ? "in" : "eq"),
      value,
    });
  });

  return crudFilters;
};


/**
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/hooks/table/useTable/} for more details.
 *
 * @typeParam TQueryFnData - Result data returned by the query function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}
 * @typeParam TError - Custom error object that extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#httperror `HttpError`}
 * @typeParam TData - Result data returned by the `select` function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}. Defaults to `TQueryFnData`
 *
 */
export const useTableFromQuery = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TData extends BaseRecord = TQueryFnData,
>({
  filters: filtersFromProp,
  sorters: sortersFromProp,
  successNotification,
  errorNotification,
  queryOptions,
}: useTableFromQueryProps<
  TQueryFnData,
  TError,
  TData
>): useTableFromQueryReturnType<TData, TError> => {
  const isServerSideFilteringEnabled =
    (filtersFromProp?.mode || "server") === "server";
  const isServerSideSortingEnabled =
    (sortersFromProp?.mode || "server") === "server";

  const preferredInitialFilters = filtersFromProp?.initial;
  const preferredPermanentFilters =
    filtersFromProp?.permanent ?? [];

  const preferredInitialSorters = sortersFromProp?.initial;
  const preferredPermanentSorters =
    sortersFromProp?.permanent ?? [];

  const [sorters, setSorters] = useState<CrudSort[]>(
    setInitialSorters(preferredPermanentSorters, preferredInitialSorters ?? []),
  );

  const [filters, setFilters] = useState<CrudFilter[]>(
    setInitialFilters(preferredPermanentFilters, preferredInitialFilters ?? []),
  );

  const queryResult = useListFromQuery<TQueryFnData, TError, TData>({
    filters: isServerSideFilteringEnabled
      ? unionFilters(preferredPermanentFilters, filters)
      : undefined,
    sorters: isServerSideSortingEnabled
      ? unionSorters(preferredPermanentSorters, sorters)
      : undefined,
    queryOptions,
    // overtimeOptions,
    successNotification,
    errorNotification,
  });

  const setFiltersAsMerge = useCallback(
    (newFilters: CrudFilter[]) => {
      setFilters((prevFilters) =>
        unionFilters(preferredPermanentFilters, newFilters, prevFilters),
      );
    },
    [preferredPermanentFilters],
  );

  const setFiltersWithSetter = useCallback(
    (setter: (prevFilters: CrudFilter[]) => CrudFilter[]) => {
      setFilters((prev) =>
        unionFilters(preferredPermanentFilters, setter(prev)),
      );
    },
    [preferredPermanentFilters],
  );

  const setFiltersFn: useTableFromQueryReturnType<TQueryFnData>["setFilters"] =
    useCallback(
      (setterOrFilters) => {
        if (typeof setterOrFilters === "function") {
          setFiltersWithSetter(setterOrFilters);
        } else {
          setFiltersAsMerge(setterOrFilters);
        }
      },
      [setFiltersWithSetter, setFiltersAsMerge],
    );

  const setSortWithUnion = useCallback(
    (newSorter: CrudSort[]) => {
      setSorters(() => unionSorters(preferredPermanentSorters, newSorter));
    },
    [preferredPermanentSorters],
  );

  const onChange = (
    _: TablePaginationConfig,
    tableFilters: Record<string, FilterValue | null>,
    sorter: SorterResult | SorterResult[],
  ) => {
    if (tableFilters && Object.keys(tableFilters).length > 0) {
      // Map Antd:Filter -> refine:CrudFilter
      setFiltersFn(
        mapAntdFilterToCrudFilter(
          tableFilters,
          filters,
          preferredInitialFilters,
        ),
      );
    }

    if (sorter && Object.keys(sorter).length > 0) {
      // Map Antd:Sorter -> refine:CrudSorting
      setSortWithUnion(mapAntdSorterToCrudSorting(sorter));
    }
  };

  return {
    tableProps: {
      dataSource: queryResult.result?.data || [],
      loading: queryResult.query?.isLoading,
      onChange,
      pagination: false,
      scroll: { x: true },
    },
    tableQuery: queryResult.query,
    sorters,
    filters,
    setSorters: setSortWithUnion,
    setFilters: setFiltersFn,
    overtime: queryResult.overtime,
    result: queryResult.result,
  };
};
