import type { ButtonProps } from "antd";

import type {
  RefineCreateButtonProps,
  RefineDeleteButtonProps,
  RefineEditButtonProps,
  RefineExportButtonProps,
  RefineListButtonProps,
  RefineSaveButtonProps,
  RefineShowButtonProps,
} from "@/core/refine-types";

export type ShowButtonProps = RefineShowButtonProps<ButtonProps>;

export type CreateButtonProps = RefineCreateButtonProps<ButtonProps>;

export type DeleteButtonProps = RefineDeleteButtonProps<ButtonProps>;

export type EditButtonProps = RefineEditButtonProps<ButtonProps>;

export type ExportButtonProps = RefineExportButtonProps<ButtonProps>;

export type ListButtonProps = RefineListButtonProps<ButtonProps>;

export type SaveButtonProps = RefineSaveButtonProps<ButtonProps>;
