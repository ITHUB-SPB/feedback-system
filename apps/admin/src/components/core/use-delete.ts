import {
  type UseMutationOptions,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useDataProvider,
  useInvalidate,
  useKeys,
  useLog,
  useOnError,
  useResourceParams,
  useLoadingOvertime,
} from "@refinedev/core";

import type {
  BaseKey,
  BaseRecord,
  DeleteOneResponse,
  HttpError,
  IQueryKeys,
  PrevContext as DeleteContext,
  PreviousQuery,
  SuccessErrorNotification,
  UseLoadingOvertimeReturnType,
  UseLoadingOvertimeOptionsProps,
} from "@refinedev/core";

import { useHandleNotification } from "./use-notification";

export type DeleteParams<TData, TError, TVariables> = {
  /**
   * id for mutation function
   */
  id: BaseKey;
  /**
   * Resource name for API data interactions
   */
  resource: string;
  /**
   *  You can use it to manage the invalidations that will occur at the end of the mutation.
   */
  invalidates?: Array<keyof IQueryKeys | string>;
  /**
   * Values for mutation function
   */
  values?: TVariables;
} & SuccessErrorNotification<DeleteOneResponse<TData>, TError, BaseKey>;

export type UseDeleteReturnType<
  TData extends BaseRecord = BaseRecord,
  TError = HttpError,
  TVariables = {},
> = {
  mutation: UseMutationResult<
    DeleteOneResponse<TData>,
    TError,
    DeleteParams<TData, TError, TVariables>,
    DeleteContext<TData>
  >;
  mutate: UseMutationResult<
    DeleteOneResponse<TData>,
    TError,
    DeleteParams<TData, TError, TVariables>,
    DeleteContext<TData>
  >["mutate"];
  mutateAsync: UseMutationResult<
    DeleteOneResponse<TData>,
    TError,
    DeleteParams<TData, TError, TVariables>,
    DeleteContext<TData>
  >["mutateAsync"];
} & UseLoadingOvertimeReturnType;

export type UseDeleteProps<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
> = {
  mutationOptions?: Omit<
    UseMutationOptions<
      DeleteOneResponse<TData>,
      TError,
      DeleteParams<TData, TError, TVariables>,
      DeleteContext<TData>
    >,
    "mutationFn" | "onError" | "onSuccess" | "onSettled" | "onMutate"
  >;
} & UseLoadingOvertimeOptionsProps;

/**
 * `useDelete` is a modified version of `react-query`'s {@link https://tanstack.com/query/v5/docs/framework/react/reference/useMutation `useMutation`} for delete mutations.
 *
 * It uses `deleteOne` method as mutation function from the `dataProvider` which is passed to `<Refine>`.
 *
 * @see {@link https://refine.dev/docs/api-reference/core/hooks/data/useDelete} for more details.
 *
 * @typeParam TData - Result data of the query extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}
 * @typeParam TError - Custom error object that extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences/#httperror `HttpError`}
 * @typeParam TVariables - Values for params. default `{}`
 *
 */
export const useDelete = <
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
>({
  mutationOptions,
  overtimeOptions,
}: UseDeleteProps<TData, TError, TVariables> = {}): UseDeleteReturnType<
  TData,
  TError,
  TVariables
> => {
  const { mutate: checkError } = useOnError();
  const dataProvider = useDataProvider();

  const { select } = useResourceParams();
  const queryClient = useQueryClient();

  // const { notificationDispatch } = useCancelNotification();
  const { log } = useLog();

  const handleNotification = useHandleNotification();
  const invalidateStore = useInvalidate();
  const { keys } = useKeys();

  const mutation = useMutation<
    DeleteOneResponse<TData>,
    TError,
    DeleteParams<TData, TError, TVariables>,
    DeleteContext<TData>
  >({
    mutationFn: ({ id, resource: resourceName, values }) => {
      const { resource } = select(resourceName);

      return dataProvider("default").deleteOne<TData, TVariables>({
        resource: resource.name,
        id,
        variables: values,
      });
    },
    onMutate: async ({ resource: resourceName }) => {
      const { identifier } = select(resourceName);

      const resourceKeys = keys().data("default").resource(identifier);

      await queryClient.cancelQueries({
        queryKey: resourceKeys.get(),
      });

      const previousQueries: PreviousQuery<TData>[] =
        queryClient.getQueriesData({
          queryKey: resourceKeys.get(),
        });

      return {
        previousQueries,
        queryKey: resourceKeys.get(),
      };
    },
    onSettled: (
      _data,
      _error,
      { resource: resourceName, invalidates = ["list", "many"] },
    ) => {
      const { identifier } = select(resourceName);

      // invalidate the cache for the list and many queries:
      invalidateStore({
        resource: identifier,
        dataProviderName: "default",
        invalidates,
      });
    },
    onSuccess: (_data, { id, resource: resourceName, successNotification }) => {
      const { resource, identifier } = select(resourceName);

      const resourceKeys = keys().data("default").resource(identifier);

      // Remove the queries from the cache:
      queryClient.removeQueries({
        queryKey: resourceKeys.action("one").get(),
      });

      handleNotification(successNotification);

      log?.mutate({
        action: "delete",
        resource: resource.name,
        meta: {
          id,
        },
      });

      // Remove the queries from the cache:
      queryClient.removeQueries({
        queryKey: resourceKeys.action("one").get(),
      });
    },
    onError: (
      err: TError,
      { id, resource: resourceName, errorNotification },
      context,
    ) => {
      const { identifier } = select(resourceName);

      // set back the queries to the context:
      if (context) {
        for (const query of context.previousQueries) {
          queryClient.setQueryData(query[0], query[1]);
        }
      }

      checkError(err);

      const notificationConfig =
        typeof errorNotification === "function"
          ? errorNotification(err, id, identifier)
          : errorNotification;

      handleNotification(notificationConfig);
    },
    mutationKey: keys().data().mutation("delete").get(),
    ...mutationOptions,
    meta: {
      ...mutationOptions?.meta,
    },
  });

  const { elapsedTime } = useLoadingOvertime({
    ...overtimeOptions,
    isLoading: mutation.isPending,
  });

  return {
    mutation,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    overtime: { elapsedTime },
  };
};
