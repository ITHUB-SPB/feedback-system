import * as v from "valibot";

export const idSchema = v.pipe(
  v.union([v.pipe(v.string(), v.transform(Number), v.number()), v.number()]),
  v.integer(),
  v.minValue(1),
);

export const userRoleSchema = v.picklist([
  "superAdmin",
  "moderator",
  "official",
  "citizen"
] as const);
