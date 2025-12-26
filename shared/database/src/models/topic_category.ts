import * as v from "valibot";
import { idSchema, type GeneratedId } from "./_base";

export const topicCategorySchema = v.object({
  id: idSchema,
  title: v.pipe(v.string(), v.nonEmpty()),
});

export type TopicCategoryTable = v.InferOutput<typeof topicCategorySchema> &
  GeneratedId;
