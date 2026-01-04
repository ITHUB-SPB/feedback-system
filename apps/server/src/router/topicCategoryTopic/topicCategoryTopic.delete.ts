import { requireModeratorProcedure } from "@shared/api";

const deleteTopicCategoryTopic =
  requireModeratorProcedure.topicCategoryTopic.delete.handler(
    async ({ context, input, errors }) => {
      try {
        await context.db
          .deleteFrom("topic_category_topic")
          .where("topic_category_topic.id", "=", Number(input.id))
          .executeTakeFirstOrThrow();
        return { status: "ok" };
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: `Ошибка при удалении пары топик-категория с ID ${input.id}`,
        });
      }
    },
  );

export default deleteTopicCategoryTopic;
