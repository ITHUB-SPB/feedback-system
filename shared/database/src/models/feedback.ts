import * as v from "valibot";
import { idSchema, type GeneratedId, type GeneratedTime } from "./_base";

export const feedbackSchema = v.object({
  id: idSchema,
  project_id: idSchema,
  description: v.string(),
  feedback_type_id: idSchema,
  topic_id: v.nullable(idSchema),
  person_id: v.pipe(v.string(), v.nonEmpty()),
  feedback_status_id: idSchema,
  created_at: v.union([
    v.date(),
    v.pipe(v.string(), v.isoTimestamp()),
    v.pipe(v.string(), v.isoDateTime()),
  ]),
});

export type FeedbackTable = v.InferOutput<typeof feedbackSchema> &
  GeneratedId &
  GeneratedTime;
