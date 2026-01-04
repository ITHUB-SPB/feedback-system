import type { CardProps } from "antd";

import type {
  CreateButtonProps,
  DeleteButtonProps,
  SaveButtonProps,
} from "../buttons/types";

import type {
  RefineCrudCreateProps,
  RefineCrudEditProps,
  RefineCrudListProps,
  RefineCrudShowProps,
} from "@/core/refine-types";

export type CreateProps = RefineCrudCreateProps<SaveButtonProps>;

export type EditProps = RefineCrudEditProps<SaveButtonProps, DeleteButtonProps>;

export type ListProps = RefineCrudListProps<CreateButtonProps>;

export type ShowProps = RefineCrudShowProps<CardProps>;
