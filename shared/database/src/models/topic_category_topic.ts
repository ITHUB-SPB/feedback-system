import * as v from "valibot";
import { idSchema, type GeneratedId } from "./_base";
import { topicCategorySchema } from "./topic_category";
import { topicSchema } from "./topic";

export const topicCategoryTopicSchema = v.object({
  id: idSchema,
  topic_id: v.pick(topicSchema, ["id"]),
  topic_category_id: v.pick(topicCategorySchema, ["id"]),
});

export type TopicCategoryTopicTable = v.InferOutput<
  typeof topicCategoryTopicSchema
> &
  GeneratedId;
