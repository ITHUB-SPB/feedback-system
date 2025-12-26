import { oc } from "@orpc/contract";
import * as v from "valibot";

import { topicCategorySchema } from "@shared/database/models/topic_category";

const topicCategoryContract = oc
  .tag("Категории замечаний")
  .prefix("/topic_categories")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "Список категорий замечаний",
      })
      .output(v.array(topicCategorySchema)),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Создание новой категории",
      })
      .input(v.pick(topicCategorySchema, ["title"]))
      .output(topicCategorySchema),
  });

export default topicCategoryContract;
