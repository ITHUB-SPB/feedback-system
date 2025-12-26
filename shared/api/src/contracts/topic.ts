import { oc } from "@orpc/contract";
import * as v from "valibot";
import { topicSchema } from "@shared/database/models/topic";

const topicContract = oc
  .tag("Категории замечаний")
  .prefix("/topics")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "Список топиков",
      })
      .output(v.array(topicSchema)),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Создание топика",
      })
      .input(v.omit(topicSchema, ["id"]))
      .output(topicSchema),
  });

export default topicContract;
