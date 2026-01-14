import { oc } from "@orpc/contract";
import * as v from "valibot";

import { topicCategoryTopicSchema } from "@shared/database/models/topic_category_topic";
import { topicCategorySchema } from "@shared/database/models/topic_category";
import { topicSchema } from "@shared/database/models/topic";

import { baseInputAll, baseInputOne, structuredInputAll } from "./_inputs";

const getTopicCategoryTopicSchema = v.object({
  ...topicCategoryTopicSchema.entries,
  topic: topicSchema.entries["title"],
  topic_category: topicCategorySchema.entries["title"],
});

const topicCategoryTopicContract = oc
  .tag("Категории замечаний")
  .prefix("/topic_category_topics")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "Список пар Топик-Категория",
      })
      .input(structuredInputAll)
      .output(v.array(getTopicCategoryTopicSchema)),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Создание пары Топик-Категория",
      })
      .input(
        v.pick(topicCategoryTopicSchema, ["topic_id", "topic_category_id"]),
      )
      .output(getTopicCategoryTopicSchema),

    delete: oc
      .route({
        method: "DELETE",
        path: "/{id}",
        summary: "Удаление пары Топик-Категория",
      })
      .input(baseInputOne),
  });

export default topicCategoryTopicContract;
