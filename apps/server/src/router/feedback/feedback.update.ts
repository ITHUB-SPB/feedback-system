import { requireOfficialProcedure } from "@shared/api";
import { sendCitizenEmail, sendOfficialEmail } from "../../queue";
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

      if (body.feedback_status_id) {
        const citizen = await context.db
          .selectFrom("user")
          .select(["email", "firstName", "lastName", "middleName"])
          .executeTakeFirstOrThrow();

        const citizenFullName = citizen.middleName
          ? `${citizen.firstName} ${citizen.middleName}`
          : `${citizen.firstName}`;

        // await sendCitizenEmail(
        //   citizen.email,
        //   citizenFullName,
        //   result.feedback_status,
        // );
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
