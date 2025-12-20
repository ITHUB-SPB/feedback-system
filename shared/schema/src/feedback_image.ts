import * as v from "valibot";
import { idSchema } from "./base/fields";

export const feedbackImageSchema = v.object({
  id: idSchema,
  feedback_id: idSchema,
  link_to_s3: v.pipe(v.string(), v.nonEmpty())
});

export type FeedbackImageTable = v.InferOutput<typeof feedbackImageSchema>;
