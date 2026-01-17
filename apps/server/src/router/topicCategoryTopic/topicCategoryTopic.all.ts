import { publicProcedure } from "@shared/api";
import { type Tables } from "@shared/database";

const mapOperatorsToSql = {
  eq: "=",
  ne: "!=",
  lt: "<",
  gt: ">",
  in: "in",
} as const;

const allTopicCategoryTopics = publicProcedure.topicCategoryTopic.all.handler(
  async ({ context, input, errors }) => {
    try {
      const { filter, sort } = input;
      console.log(filter, sort);

      let query = context.db
        .selectFrom("topic_category_topic")
        .innerJoin("topic", "topic.id", "topic_category_topic.topic_id")
        .innerJoin(
          "topic_category",
          "topic_category.id",
          "topic_category_topic.topic_category_id",
        )
        .select([
          "topic_category_topic.id as id",
          "topic_category_topic.topic_id",
          "topic_category_topic.topic_category_id",
          "topic.title as topic",
          "topic_category.title as topic_category",
        ]);

      if (filter?.length) {
        type WhereValue = string | number | string[] | number[];

        for (const filterObject of filter) {
          let column = filterObject.field as
            | keyof Tables["topic_category_topic"]
            | keyof Tables["topic"]
            | keyof Tables["topic_category"];

          if (column === "id") {
            column =
              "topic_category_topic.id" as keyof Tables["topic_category_topic"];
          }

          const operator =
            filterObject.operator as keyof typeof mapOperatorsToSql;

          let value: WhereValue = Number.isFinite(+filterObject.value)
            ? +filterObject.value
            : filterObject.value;

          if (operator === "in" && typeof value === "string") {
            const items = value.split(",");
            value = items.some((item) => !Number.isFinite(+item))
              ? items
              : items.map(Number);
          } else if (operator === "in" && typeof value === "number") {
            value = Array.isArray(value) ? value : [value];
          }

          query = query.where(
            column,
            mapOperatorsToSql[operator],
            value as number | number[],
          );
        }
      }

      if (sort !== undefined) {
        for (const { field, order } of sort) {
          if (field === "topic_id") {
            query = query.orderBy("topic.title", order);
          }
          if (field === "topic_category_id") {
            query = query.orderBy("topic_category.title", order);
          }
        }
      }

      const total = (await query.execute()).length;
      context.resHeaders?.set("x-total-count", String(total));

      return await query.execute();
    } catch (error) {
      console.error(error);
      throw errors.INTERNAL_SERVER_ERROR();
    }
  },
);

export default allTopicCategoryTopics;
