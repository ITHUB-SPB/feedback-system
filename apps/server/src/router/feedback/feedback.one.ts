import { requireOfficialProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";
import _enrichSelect from "./_enrichSelect";

const oneFeedback = requireOfficialProcedure.feedback.one.handler(
  async ({ context, input, errors }) => {
    try {
      const feedback = await _baseSelect(context.db)
        .innerJoin("user", "user.id", "feedback.person_id")
        .select([
          "user.email as respondentEmail",
          "user.phone as respondentPhone",
          "user.firstName as respondentFirstName",
          "user.lastName as respondentLastName",
          "user.middleName as respondentMiddleName",
        ])
        .where("feedback.id", "=", Number(input.id))
        .executeTakeFirstOrThrow();

      const feedbackImages = await context.db
        .selectFrom("feedback_image")
        .innerJoin("feedback", "feedback_image.feedback_id", "feedback.id")
        .select("feedback_image.link_to_s3")
        .where("feedback.id", "=", Number(input.id))
        .execute();

      const enrichedData = await _enrichSelect(context.db, {
        ...feedback,
        created_at: new Date(feedback.created_at).toISOString(),
      });

      return {
        ...enrichedData,
        image_links: feedbackImages.map(({ link_to_s3 }) => link_to_s3),
      };
    } catch (error) {
      console.error(error);
      throw errors.NOT_FOUND({
        message: `Не найдено записи с ID ${input.id}`,
      });
    }
  },
);

export default oneFeedback;
