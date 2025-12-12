import * as v from "valibot";

export const idSchema = v.pipe(
  v.union([v.pipe(v.string(), v.transform(Number), v.number()), v.number()]),
  v.integer(),
  v.minValue(1),
);

// Добавьте эти схемы:
export const userRoleSchema = v.picklist([
  "superAdmin",
  "moderator",
  "official",
  "citizen"
] as const);

export const signUpExtendedSchema = v.object({
  email: v.string([v.email()]),
  name: v.string([v.minLength(2)]),
  password: v.string([v.minLength(8)]),
  image: v.optional(v.string([v.url()])),
  callbackURL: v.optional(v.string([v.url()])),
  rememberMe: v.optional(v.boolean()),
  role: v.optional(userRoleSchema, "citizen"),
  additionalData: v.optional(v.record(v.string(), v.any())),
});

export type SignUpExtendedInput = v.InferOutput<typeof signUpExtendedSchema>;