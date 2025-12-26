import * as v from "valibot";
import { idSchema, type GeneratedId, type GeneratedTime } from "./_base";
import { feedbackSchema } from "./feedback";

export const feedbackImageSchema = v.object({
  id: idSchema,
  feedback_id: v.pick(feedbackSchema, ["id"]),
  link_to_s3: v.pipe(v.string(), v.nonEmpty()),
  created_at: v.pipe(v.string()), // TODO: narrow
});

export type FeedbackImageTable = v.InferOutput<typeof feedbackImageSchema> &
  GeneratedId &
  GeneratedTime<"created_at">;
