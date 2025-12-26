import * as v from "valibot";

export const userSchema = v.object({
  id: v.string(),
  createdAt: v.fallback(v.date(), new Date()),
  updatedAt: v.fallback(v.date(), new Date()),
  email: v.pipe(v.string(), v.email()),
  emailVerified: v.fallback(v.boolean(), true),
  name: v.pipe(v.string(), v.nonEmpty()),
  image: v.optional(v.nullable(v.string())),
  banned: v.optional(v.nullable(v.boolean())),
  banReason: v.optional(v.nullable(v.string())),
  banExpires: v.optional(v.nullable(v.date())),
  role: v.picklist(["citizen", "official", "moderator"]),
  firstName: v.pipe(v.string(), v.nonEmpty()),
  lastName: v.pipe(v.string(), v.nonEmpty()),
  middleName: v.optional(v.string()),
  phone: v.optional(v.nullable(v.string())),
  social: v.optional(v.nullable(v.string())),
});

export type UserTable = v.InferOutput<typeof userSchema>;
