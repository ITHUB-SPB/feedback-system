import { oc } from "@orpc/contract";
import * as v from "valibot";
import { feedbackTypeSchema } from "@shared/database/models/feedback_type";

const feedbackTypeContract = oc
  .tag("Обращения")
  .prefix("/feedback_types")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "Список типов обращений",
      })
      .output(v.array(feedbackTypeSchema)),
  });

export default feedbackTypeContract;
