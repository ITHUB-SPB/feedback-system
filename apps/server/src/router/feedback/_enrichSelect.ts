import { db } from "@shared/database";

function formatFullName(
  lastName: string,
  firstName: string,
  middleName?: string | null,
) {
  return [lastName, firstName, middleName].filter(Boolean).join(" ");
}

export default async function _enrichSelect(
  databaseInstance: typeof db,
  feedbackData: any,
) {
  try {
    const responsiblePerson = await databaseInstance
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
        feedbackData.administrative_unit_id,
      )
      .executeTakeFirst();

    return {
      ...feedbackData,
      person_full_name: formatFullName(
        feedbackData.respondentLastName,
        feedbackData.respondentFirstName,
        feedbackData.respondentMiddleName,
      ),
      responsible_person_full_name: responsiblePerson
        ? formatFullName(
            responsiblePerson.officialLastName,
            responsiblePerson.officialFirstName,
            responsiblePerson.officialMiddleName,
          )
        : null,
      person_phone: feedbackData.person_phone || null,
    };
  } catch (error) {
    console.error(error);
  }
}
