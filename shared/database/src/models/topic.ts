import * as v from "valibot";
import { idSchema, type GeneratedId } from "./_base";

export const topicSchema = v.object({
  id: idSchema,
  title: v.pipe(v.string(), v.nonEmpty()),
});

export type TopicTable = v.InferOutput<typeof topicSchema> & GeneratedId;
