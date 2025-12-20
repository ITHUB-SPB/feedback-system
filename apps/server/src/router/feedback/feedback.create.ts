import { publicProcedure } from "@shared/api";
import auth from "../../auth";
import upload from "../../s3";

const createFeedback = publicProcedure.feedback.create.handler(
  async ({ context, input, errors }) => {
    const transaction = await context.db.startTransaction().execute();
    let respondentId;
    let isUserCreated = false;

    try {
      respondentId = (
        await context.db
          .selectFrom("user")
          .select("user.id")
          .where("user.email", "=", input.body.email)
          .executeTakeFirst()
      )?.id;

      if (!respondentId) {
        try {
          const newUser = await auth.api.createUser({
            body: {
              email: input.body.email,
              name: input.body.email,
              password: input.body.email,
              role: "citizen",
              data: {
                phone: input.body.phone ?? "",
                firstName: input.body.first_name,
                lastName: input.body.last_name,
                middleName: input.body.middle_name ?? "",
              },
            },
          });
          respondentId = newUser.user.id;
          isUserCreated = true;
        } catch (error) {
          console.error(error);
          throw new Error("Ошибка при создании аккаунта");
        }
      }

      const { id: pendingStatusId } = await transaction
        .selectFrom("feedback_status")
        .select("id")
        .where("feedback_status.title", "=", "pending")
        .executeTakeFirstOrThrow();

      const newFeedbackValues = {
        project_id: input.body.project_id,
        description: input.body.description,
        feedback_type_id: input.body.feedback_type_id,
        topic_id: input.body.topic_category_topic_id ?? null,
        person_id: respondentId,
        feedback_status_id: pendingStatusId,
      };

      const { id: feedbackId } = await transaction
        .insertInto("feedback")
        .values(newFeedbackValues)
        .returning("id")
        .executeTakeFirstOrThrow();

      if (feedbackId === undefined) {
        throw new Error("Ошибка при создании записи фидбека");
      }

      const images = [];
      if (input.body.files && Array.isArray(input.body.files)) {
        images.push(...input.body.files);
      } else if (input.body.files) {
        images.push(input.body.files);
      }

      await Promise.all(
        images.map(async (file) => {
          try {
            const fileUrl = await upload(file, "photos", context.environment);
            await transaction
              .insertInto("feedback_image")
              .values({
                feedback_id: Number(feedbackId),
                link_to_s3: fileUrl,
              })
              .execute();
          } catch (error) {
            console.error(error);
            throw new Error("Error on images upload");
          }
        }),
      );

      await transaction.commit().execute();
    } catch (error) {
      await transaction.rollback().execute();
      if (isUserCreated) {
        await auth.api.removeUser({
          body: {
            userId: respondentId,
          },
          headers: context.headers,
        });
      }
      console.error(error);
      throw errors.CONFLICT({
        message: (error as Error).message,
      });
    }
  },
);

export default createFeedback;
