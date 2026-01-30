import React from "react";
import type { Dispatch, SetStateAction } from "react";

import { useQuery, useMutation } from "@tanstack/react-query";
import type {
  QueryObserverResult,
  UseQueryOptions,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import Form, { type FormInstance, type FormProps } from "antd/es/form";
import type { ButtonProps } from "antd/es/button";
import { useForm as useFormSF, type UseFormConfig } from "sunflower-antd";

import {
  type HttpError,
  type BaseKey,
  type BaseRecord,
  type CreateResponse,
  type UpdateResponse,
} from "@refinedev/core";

export type UseUpdateFormProps<
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
  TData extends BaseRecord = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends HttpError = TError,
> = {
  id: BaseKey;
  onMutationSuccess?: (
    data: CreateResponse<TResponse> | UpdateResponse<TResponse>,
    variables: TVariables,
    context: any,
    isAutoSave?: boolean,
  ) => void;
  onMutationError?: (
    error: TResponseError,
    variables: TVariables,
    context: any,
    isAutoSave?: boolean,
  ) => void;
  queryOptions: UseQueryOptions;
  mutationOptions: UseMutationOptions;
} & Pick<UseFormConfig, "defaultFormValues">;

export type UseUpdateFormReturnType<
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
  TData extends BaseRecord = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends HttpError = TError,
> = {
  id: BaseKey;
  setId: Dispatch<SetStateAction<BaseKey | undefined>>;
  query: QueryObserverResult<unknown, TError>;
  mutation: UseMutationResult;
  formLoading: boolean;
  onFinish: (
    values: TVariables,
  ) => Promise<CreateResponse<TResponse> | UpdateResponse<TResponse> | void>;
} & {
  form: FormInstance<TVariables>;
  formProps: FormProps<TVariables>;
  saveButtonProps: ButtonProps & {
    onClick: () => void;
  };
  onFinish: (
    values?: TVariables,
  ) => Promise<CreateResponse<TResponse> | UpdateResponse<TResponse> | void>;
} & Pick<
    ReturnType<typeof useFormSF<TResponse, TVariables>>,
    "defaultFormValuesLoading"
  >;

/**
 * `useForm` is used to manage forms. It uses Ant Design {@link https://ant.design/components/form/ Form} data scope management under the hood and returns the required props for managing the form actions.
 *
 * @see {@link https://refine.dev/docs/api-reference/core/hooks/useForm} for more details.
 *
 * @typeParam TData - Result data of the query extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}
 * @typeParam TError - Custom error object that extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences/#httperror `HttpError`}
 * @typeParam TVariables - Values for params. default `{}`
 * @typeParam TData - Result data returned by the `select` function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}. Defaults to `TQueryFnData`
 * @typeParam TResponse - Result data returned by the mutation function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}. Defaults to `TData`
 * @typeParam TResponseError - Custom error object that extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#httperror `HttpError`}. Defaults to `TError`
 *
 *
 */
export const useUpdateForm = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
  TData extends BaseRecord = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends HttpError = TError,
>({
  onMutationSuccess,
  onMutationError,
  queryOptions,
  mutationOptions,
  id,
  defaultFormValues,
}: UseUpdateFormProps<
  TQueryFnData,
  TError,
  TVariables,
  TData,
  TResponse,
  TResponseError
>): UseUpdateFormReturnType<
  TQueryFnData,
  TError,
  TVariables,
  TData,
  TResponse,
  TResponseError
> => {
  const [formAnt] = Form.useForm();

  const formSF = useFormSF<TResponse, TVariables>({
    form: formAnt,
    defaultFormValues,
  });
  const { form } = formSF;

  const queryResult = useQuery({
    ...queryOptions,
    enabled: id !== undefined && (queryOptions?.enabled ?? true),
  });

  const { mutate } = useMutation({
    ...mutationOptions,
  });

  const formLoading = queryResult.isFetching;

  const onFinish = (values: TVariables) => {
    mutate(values, {
      onSuccess: onMutationSuccess
        ? (data, _, context) => {
            onMutationSuccess?.(data, values, context, false);
          }
        : undefined,
      onError: onMutationError
        ? (error: TResponseError, _, context) => {
            onMutationError?.(error, values, context, false);
          }
        : undefined,
    });
  };

  const onFinishRef = React.useRef(onFinish);

  React.useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  // populate form with data when query is ready or id changes
  // form populated via initialValues prop
  React.useEffect(() => {
    form.resetFields();
  }, [queryResult?.data, id]);

  const onKeyUp = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      form.submit();
    }
  };

  const saveButtonProps = {
    disabled: formLoading,
    onClick: () => {
      form.submit();
    },
  };

  return {
    form: formSF.form,
    formProps: {
      ...formSF.formProps,
      onFinish: (values: TVariables) => onFinish(values),
      onKeyUp,
      initialValues: queryResult?.data,
    },
    saveButtonProps,
    defaultFormValuesLoading: formSF.defaultFormValuesLoading,
    onFinish: (values?: TVariables) => {
      return onFinish(values ?? formSF.form.getFieldsValue(true));
    },
  };
};
