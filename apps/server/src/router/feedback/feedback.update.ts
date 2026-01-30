import { requireOfficialProcedure } from "@shared/api";
import {
  citizenStatusEmailQueue,
  citizenStatusWithCommentEmailQueue,
} from "@shared/mq";
import _baseSelect from "./_baseSelect";

const updateFeedback = requireOfficialProcedure.feedback.update.handler(
  async ({ context, input, errors }) => {
    const { params, body } = input;

    try {
      await context.db
        .updateTable("feedback")
        .set({
          ...body,
          updated_at: new Date(),
        })
        .where("feedback.id", "=", Number(params.id))
        .executeTakeFirstOrThrow();

      const result = await _baseSelect(context.db)
        .where("feedback.id", "=", Number(params.id))
        .innerJoin("user", "feedback.person_id", "user.id")
        .executeTakeFirstOrThrow();

      if (
        !body.feedback_status_id ||
        result.status.title === "pending" ||
        result.status.title === "archived"
      ) {
        return {};
      }

      const { email, firstName, ...rest } = await context.db
        .selectFrom("user")
        .select(["email", "firstName", "lastName", "middleName"])
        .where("user.id", "=", result.person_id)
        .executeTakeFirstOrThrow();

      const name = rest.middleName
        ? `${firstName} ${rest.middleName}`
        : firstName;

      if (result.status.title === "declined") {
        await citizenStatusWithCommentEmailQueue.add(
          "citizen-status-declined",
          {
            to: email,
            name,
            status: "declined",
            comment: result.feedback_status_comment as string,
          },
        );
      } else {
        await citizenStatusEmailQueue.add(`citizen-status-${result.status.title}`, {
          to: email,
          name,
          status: result.status.title,
        });
      }

      return {};
    } catch (error) {
      console.error(error);
      throw errors.NOT_FOUND({
        message: `Не удалось обновить запись с ID ${params.id}`,
      });
    }
  },
);

export default updateFeedback;
