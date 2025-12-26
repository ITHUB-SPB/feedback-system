import * as v from "valibot";
import { idSchema, type GeneratedId } from "./_base";
import { topicCategorySchema } from "./topic_category";
import { topicSchema } from "./topic";

export const topicCategoryTopicSchema = v.object({
  id: idSchema,
  topic_id: topicSchema.entries["id"],
  topic_category_id: topicCategorySchema.entries["id"],
});

export type TopicCategoryTopicTable = v.InferOutput<
  typeof topicCategoryTopicSchema
> &
  GeneratedId;
