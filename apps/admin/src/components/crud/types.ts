import type React from "react";
import type { PropsWithChildren } from "react";

import type { BaseKey, MutationMode } from "@refinedev/core";
import type { CardProps } from "antd";

import type { DeleteButtonProps, SaveButtonProps } from "@/components/buttons";

type RefineCrudCreateProps<
  TSaveButtonProps extends {} = Record<keyof any, unknown>,
> = PropsWithChildren<{
  resource: string;
  title?: React.ReactNode;
  headerButtons?: React.ReactNode | React.ReactNode[];
  footerButtons?: React.ReactNode | React.ReactNode[];
  isLoading?: boolean;
  saveButtonProps?: TSaveButtonProps;
}>;

type RefineCrudEditProps<
  TSaveButtonProps extends {} = Record<keyof any, unknown>,
  TDeleteButtonProps extends {} = Record<keyof any, unknown>,
> = PropsWithChildren<{
  resource: string;
  title: React.ReactNode;
  headerButtons?: React.ReactNode;
  footerButtons?: React.ReactNode;
  dataProviderName?: string;
  isLoading?: boolean;
  canDelete?: boolean;
  saveButtonProps?: TSaveButtonProps;
  deleteButtonProps?: TDeleteButtonProps;
  /**
   * [Determines when mutations are executed](/docs/advanced-tutorials/mutation-mode/)
   * @default `"pessimistic"`\*
   */
  mutationMode?: MutationMode;
  recordItemId: BaseKey;
}>;

type RefineCrudShowProps<
  TExtraProps extends {} = {},
  TDeleteButtonProps extends {} = Record<keyof any, unknown>,
> = PropsWithChildren<{
  /**
   * Resource name for API data interactions
   * @default Reads `:resource` from the URL
   */
  resource: string;
  /**
   * Title of the edit view
   * @default Show {resource.name}
   */
  title: React.ReactNode;
  /**
   * Header action buttons to be displayed in the header
   */
  headerButtons?: React.ReactNode;
  /**
   * Footer action buttons to be displayed in the footer
   * @default `null`
   */
  footerButtons?: React.ReactNode | React.ReactNode[];
  /**
   * To specify a data provider other than default use this property
   */
  dataProviderName?: string;
  /**
   * Loading state of the component
   */
  isLoading?: boolean;
  /**
   * Adds a `<DeleteButton />`
   * @default If the resource has `canDelete` prop it is `true` else `false`
   */
  canDelete?: boolean;
  /**
   * Adds properties for `<DeleteButton />`
   */
  deleteButtonProps?: TDeleteButtonProps;
  /**
   * Adds a `<EditButton />`
   * @default If the resource is passed a edit component, `true` else `false`
   */
  canEdit?: boolean;
  /**
   * The record id for `<RefreshButton />`
   */
  recordItemId: BaseKey;
}> &
  TExtraProps;

export type CreateProps = RefineCrudCreateProps<SaveButtonProps>;
export type EditProps = RefineCrudEditProps<SaveButtonProps, DeleteButtonProps>;
export type ShowProps = RefineCrudShowProps<CardProps>;
