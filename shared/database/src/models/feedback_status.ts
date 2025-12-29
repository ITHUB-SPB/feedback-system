import * as v from "valibot";
import { idSchema, type GeneratedId } from "./_base";

export const feedbackStatusTitleSchema = v.picklist([
  "pending",
  "banned",
  "approved",
  "proceeding",
  "declined",
  "completed",
  "archived",
]);

export const feedbackStatusSchema = v.object({
  id: idSchema,
  title: feedbackStatusTitleSchema,
  translation: v.picklist([
    "Модерация",
    "Отклонено",
    "Передано АМО",
    "В работе АМО",
    "Отклонено АМО",
    "Выполнено",
    "Архив",
  ]),
});

export type FeedbackStatusTable = v.InferOutput<typeof feedbackStatusSchema> &
  GeneratedId;
