import { oc } from "@orpc/contract";
import * as v from "valibot";

import { feedbackStatusSchema } from "@shared/database/models/feedback_status";

const feedbackStatusContract = oc
  .tag("Обращения")
  .prefix("/feedback_statuses")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "Список статусов обращения",
      })
      .output(v.array(feedbackStatusSchema)),
  });

export default feedbackStatusContract;
