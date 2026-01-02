import type {
  RefineThemedLayoutSiderProps as BaseRefineThemedLayoutSiderProps,
  RefineThemedLayoutHeaderProps,
  RefineThemedLayoutProps,
  RefineLayoutThemedTitleProps,
} from "@/core/refine-types";

type RefineThemedLayoutSiderProps = BaseRefineThemedLayoutSiderProps & {
  fixed?: boolean;
};

export type {
  RefineLayoutThemedTitleProps,
  RefineThemedLayoutSiderProps,
  RefineThemedLayoutHeaderProps,
  RefineThemedLayoutProps,
};
