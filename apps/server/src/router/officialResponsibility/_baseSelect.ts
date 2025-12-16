import { db } from "@shared/database";

export default function _baseSelect(dbInstance: typeof db) {
  return dbInstance
    .selectFrom("official_responsibility")
    .innerJoin(
      "administrative_unit",
      "administrative_unit.id",
      "official_responsibility.administrative_unit_id",
    )
    .innerJoin("user", "user.id", "official_responsibility.official_id")
    .select([
      "official_responsibility.id",
      "official_responsibility.official_id",
      "official_responsibility.administrative_unit_id",
      "administrative_unit.title as administrative_unit",
      "user.firstName as officialFirstName",
      "user.lastName as officialLastName",
      "user.middleName as officialMiddleName",
    ]);
}
