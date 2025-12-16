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
  const personFullName = formatFullName(
    feedbackData.respondentLastName,
    feedbackData.respondentFirstName,
    feedbackData.respondentMiddleName,
  );

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

  const responsiblePersonFullName = responsiblePerson
    ? formatFullName(
        responsiblePerson.officialLastName,
        responsiblePerson.officialFirstName,
        responsiblePerson.officialMiddleName,
      )
    : null;

  return {
    ...feedbackData,
    person_full_name: personFullName,
    person_phone: feedbackData.person_phone || null,
    responsible_person_full_name: responsiblePersonFullName,
  };
}
