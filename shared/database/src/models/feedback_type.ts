import * as v from "valibot";
import { idSchema, type GeneratedId } from "./_base";

export const feedbackTypeSchema = v.object({
  id: idSchema,
  title: v.picklist(["Пожелание", "Замечание"]),
});

export type FeedbackTypeTable = v.InferOutput<typeof feedbackTypeSchema> &
  GeneratedId;
