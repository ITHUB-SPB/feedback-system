import React, { useCallback } from "react";
import type { FormInstance, FormProps, ModalProps } from "antd";

import {
  type HttpError,
  type UseFormProps as UseFormPropsCore,
  type BaseRecord,
  type BaseKey,
  useUserFriendlyName,
  useInvalidate,
} from "@refinedev/core";

import { useForm, type UseFormProps, type UseFormReturnType } from "./useForm";
import { useModal } from "../modal";

export type useModalFormFromSFReturnType<TResponse, TVariables> = {
  open: boolean;
  form: FormInstance<TVariables>;
  show: (id?: BaseKey) => void;
  close: () => void;
  modalProps: ModalProps;
  formProps: FormProps<TVariables>;
  formLoading: boolean;
  defaultFormValuesLoading: boolean;
  formValues: {};
  initialValues: {};
  formResult: undefined;
  submit: (values?: TVariables) => Promise<TResponse>;
};

type useModalFormConfig = {
  action: "show" | "edit" | "create" | "clone";
};

export type UseModalFormReturnType<
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
  TData extends BaseRecord = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends HttpError = TError,
> = Omit<
  UseFormReturnType<
    TQueryFnData,
    TError,
    TVariables,
    TData,
    TResponse,
    TResponseError
  >,
  "saveButtonProps" | "deleteButtonProps"
> &
  useModalFormFromSFReturnType<TResponse, TVariables>;

export type UseModalFormProps<
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
  TData extends BaseRecord = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends HttpError = TError,
> = UseFormPropsCore<
  TQueryFnData,
  TError,
  TVariables,
  TData,
  TResponse,
  TResponseError
> &
  UseFormProps<
    TQueryFnData,
    TError,
    TVariables,
    TData,
    TResponse,
    TResponseError
  > &
  useModalFormConfig &
  {
    defaultVisible?: boolean;
    autoSubmitClose?: boolean;
    autoResetForm?: boolean;
    autoResetFormWhenClose?: boolean;
  };
/**
 * `useModalForm` hook allows you to manage a form within a modal. It returns Ant Design {@link https://ant.design/components/form/ Form} and {@link https://ant.design/components/modal/ Modal} components props.
 *
 * @see {@link https://refine.dev/docs/api-reference/antd/hooks/form/useModalForm} for more details.
 *
 * @typeParam TData - Result data of the query extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}
 * @typeParam TError - Custom error object that extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences/#httperror `HttpError`}
 * @typeParam TVariables - Values for params. default `{}`
 *
 *
 */
export const useModalForm = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
  TData extends BaseRecord = TQueryFnData,
  TResponse extends BaseRecord = TData,
  TResponseError extends HttpError = TError,
>({
  defaultVisible = false,
  autoSubmitClose = true,
  autoResetForm = true,
  autoResetFormWhenClose = true,
  invalidates,
  ...rest
}: UseModalFormProps<
  TQueryFnData,
  TError,
  TVariables,
  TData,
  TResponse,
  TResponseError
>): UseModalFormReturnType<
  TQueryFnData,
  TError,
  TVariables,
  TData,
  TResponse,
  TResponseError
> => {
  const invalidate = useInvalidate();
  const getUserFriendlyName = useUserFriendlyName();

  const action = rest.action ?? "";

  const useFormProps = useForm<
    TQueryFnData,
    TError,
    TVariables,
    TData,
    TResponse,
    TResponseError
  >({
    meta: {
      ...rest.meta,
    },
    invalidates,
    ...rest,
  });

  const { form, formProps, id, setId, formLoading, onFinish } =
    useFormProps;

  const { show, close, modalProps } = useModal({
    modalProps: {
      open: defaultVisible,
    },
  });

  const visible = modalProps.open || false;
  const sunflowerUseModal: useModalFormFromSFReturnType<TResponse, TVariables> =
  {
    modalProps,
    form,
    formLoading,
    formProps,
    formResult: undefined,
    formValues: form.getFieldsValue,
    defaultFormValuesLoading: false,
    initialValues: {},
    submit: onFinish as any,
    close,
    open: modalProps.open || false,
    show,
  };

  const saveButtonPropsSF = {
    disabled: formLoading,
    loading: formLoading,
    onClick: () => {
      form.submit();
    },
  };

  const handleClose = useCallback(() => {
    const warnWhenConfirm = window.confirm(
      "Are you sure you want to leave? You have unsaved changes.",
    );

    if (!warnWhenConfirm) {
      return
    }

    setId?.(undefined);
    sunflowerUseModal.close();

    if (autoResetFormWhenClose) {
      form.resetFields();
    }
  }, []);

  const handleShow = useCallback(
    (showId?: BaseKey) => {
      if (typeof showId !== "undefined") {
        setId?.(showId);
      }
      const needsIdToOpen = action === "edit" || action === "clone";
      const hasId = typeof showId !== "undefined" || typeof id !== "undefined";
      if (needsIdToOpen ? hasId : true) {
        sunflowerUseModal.show();
      }
    },
    [id],
  );

  const { visible: _visible, ...otherModalProps } = modalProps;
  const newModalProps = { open: _visible, ...otherModalProps };

  return {
    ...useFormProps,
    ...sunflowerUseModal,
    show: handleShow,
    close: handleClose,
    open: visible,
    formProps: {
      ...formProps,
      ...useFormProps.formProps,
      onValuesChange: formProps?.onValuesChange,
      onKeyUp: formProps?.onKeyUp,
      onFinish: async (values) => {
        await onFinish(values);

        if (autoSubmitClose) {
          close();
        }

        if (autoResetForm) {
          form.resetFields();
        }
      },
    },
    modalProps: {
      ...newModalProps,
      width: "1000px",
      okButtonProps: saveButtonPropsSF,
      title: `${getUserFriendlyName(
        `${rest.action} ${rest.resource ?? ""}`,
        "singular",
      )}`,
      okText: "Save",
      cancelText: "Cancel",
      onCancel: handleClose,
      forceRender: true,
    },
    formLoading,
  };
};
