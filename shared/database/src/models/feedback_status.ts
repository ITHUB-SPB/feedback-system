import * as v from "valibot";
import { idSchema, type GeneratedId, type GeneratedTime } from "./_base";

export const feedbackStatusTitleSchema = v.picklist([
  "pending",
  "banned",
  "approved",
  "proceeding",
  "declined",
  "completed",
  "archived",
]);

export const feedbackStatusSchema = v.union([
  v.object({
    id: idSchema,
    title: v.literal("pending"),
    translation: v.literal("Модерация"),
  }),
  v.object({
    id: idSchema,
    title: v.literal("banned"), // отклонено модератором
    translation: v.literal("Отклонено"),
  }),
  v.object({
    id: idSchema,
    title: v.literal("approved"),
    translation: v.literal("Передано АМО"),
  }),
  v.object({
    id: idSchema,
    title: v.literal("proceeding"),
    translation: v.literal("В работе АМО"),
  }),
  v.object({
    id: idSchema,
    title: v.literal("declined"), // отклонено АМО
    translation: v.literal("Отклонено АМО"),
  }),
  v.object({
    id: idSchema,
    title: v.literal("completed"),
    translation: v.literal("Выполнено"),
  }),
  v.object({
    id: idSchema,
    title: v.literal("archived"),
    translation: v.literal("Архив"),
  }),
]);

export type FeedbackStatusTable =
  | v.InferOutput<typeof feedbackStatusSchema>
  | GeneratedId
  | GeneratedTime<"created_at">
  | GeneratedTime<"updated_at">;
