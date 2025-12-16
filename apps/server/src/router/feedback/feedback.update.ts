import { requireOfficialProcedure } from "@shared/api";
import { sendCitizenEmail, sendOfficialEmail } from "../../queue";
import _baseSelect from "./_baseSelect";
import _enrichSelect from "./_enrichSelect";

const updateFeedback = requireOfficialProcedure.feedback.update.handler(
  async ({ context, input, errors }) => {
    const { params, body } = input;

    try {
      await context.db
        .updateTable("feedback")
        .set(body)
        .where("feedback.id", "=", Number(params.id))
        .executeTakeFirstOrThrow();

      const result = await _baseSelect(context.db)
        .where("feedback.id", "=", Number(params.id))
        .executeTakeFirstOrThrow();

      if (body.feedback_status_id) {
        const citizen = await context.db
          .selectFrom("user")
          .select(["email", "firstName", "lastName", "middleName"])
          .executeTakeFirstOrThrow();

        const citizenFullName = citizen.middleName
          ? `${citizen.firstName} ${citizen.middleName}`
          : `${citizen.firstName}`;

        await sendCitizenEmail(
          citizen.email,
          citizenFullName,
          result.feedback_status === "approved",
        );
      }

      if (body.feedback_status_id && result.feedback_status === "approved") {
        const official = await context.db
          .selectFrom("official_responsibility")
          .innerJoin(
            "administrative_unit",
            "administrative_unit.id",
            "official_responsibility.administrative_unit_id",
          )
          .where("administrative_unit.title", "=", result.administrative_unit)
          .select("official_responsibility.official_id")
          .executeTakeFirst();

        if (official) {
          const officialContact = await context.db
            .selectFrom("user")
            .where("user.id", "=", official.official_id)
            .select([
              "email",
              "firstName",
              "lastName",
              "middleName",
            ])
            .executeTakeFirstOrThrow();

          const feedbackImages = await context.db
            .selectFrom("feedback_image")
            .innerJoin("feedback", "feedback_image.feedback_id", "feedback.id")
            .select(["feedback_image.link_to_s3", "feedback_image.feedback_id"])
            .where("feedback.id", "=", Number(result.id))
            .execute();

          const officialName = officialContact.middleName
            ? `${officialContact.firstName} ${officialContact.middleName}`
            : officialContact.firstName;

          const categoryTopic =
            result.topic !== null ? result.topic : undefined;

          await sendOfficialEmail({
            officialName,
            categoryTopic,
            description: result.description,
            email: officialContact.email,
            createdAt: result.created_at,
            files: (feedbackImages ?? []).map(({ link_to_s3 }) => link_to_s3),
          });
        }
      }

      const enrichedData = await _enrichSelect(context.db, {
        ...result,
        created_at: new Date(result.created_at).toISOString(),
      });

      return enrichedData;
    } catch (error) {
      console.error(error);
      throw errors.NOT_FOUND({
        message: `Не удалось обновить запись с ID ${params.id}`,
      });
    }
  },
);

export default updateFeedback;
