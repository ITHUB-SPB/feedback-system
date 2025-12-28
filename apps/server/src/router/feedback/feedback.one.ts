import { requireOfficialProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

function formatFullName(
  lastName: string,
  firstName: string,
  middleName?: string | null,
) {
  return [lastName, firstName, middleName].filter(Boolean).join(" ");
}

const oneFeedback = requireOfficialProcedure.feedback.one.handler(
  async ({ context, input, errors }) => {
    try {
      const feedback = await _baseSelect(context.db)
        .innerJoin("user", "user.id", "feedback.person_id")
        .select([
          "user.email",
          "user.phone as respondentPhone",
          "user.firstName as respondentFirstName",
          "user.lastName as respondentLastName",
          "user.middleName as respondentMiddleName",
        ])
        .where("feedback.id", "=", Number(input.id))
        .executeTakeFirstOrThrow();

      const statusList = await context.db.selectFrom("feedback_status").selectAll().execute()

      const availableActionsMapping = {
        moderator: {
          pending: ["approved", "banned"],
          completed: ["archived"]
        },
        official: {
          approved: ["proceeding", "declined"],
          proceeding: ["completed", "declined"],
        }
      } as const;

      const role = context.session.role as "moderator" | "official"
      const availableActionsByRole = availableActionsMapping[role]
      const availableActionsByStatus = availableActionsByRole[feedback.status.title] ?? []
      const availableActions = availableActionsByStatus.map((action: string) => ({
        action,
        params: {
          feedback_status_id: statusList.find(({ title }) => title === action)?.id
        }
      }))

      const feedbackImages = await context.db
        .selectFrom("feedback_image")
        .innerJoin("feedback", "feedback_image.feedback_id", "feedback.id")
        .select("feedback_image.link_to_s3")
        .where("feedback.id", "=", Number(input.id))
        .execute();

      const responsiblePerson = await context.db
        .selectFrom("official_responsibility")
        .innerJoin("user", "official_responsibility.official_id", "user.id")
        .select([
          "user.firstName as officialFirstName",
          "user.lastName as officialLastName",
          "user.middleName as officialMiddleName",
        ])
        .where(
          "official_responsibility.administrative_unit_id",
          "=",
          feedback.administrative_unit_id,
        )
        .executeTakeFirst();

      return {
        ...feedback,
        person_full_name: formatFullName(
          feedback.respondentLastName,
          feedback.respondentFirstName,
          feedback.respondentMiddleName,
        ),
        responsible_person_full_name: responsiblePerson
          ? formatFullName(
            responsiblePerson.officialLastName,
            responsiblePerson.officialFirstName,
            responsiblePerson.officialMiddleName,
          )
          : null,
        person_phone: feedback.respondentPhone || null,
        availableActions,
        image_links: feedbackImages.map(({ link_to_s3 }) => link_to_s3),
        created_at: new Date(feedback.created_at).toISOString(),
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
