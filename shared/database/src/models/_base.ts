import * as v from "valibot";
import { type Generated } from "kysely";

export const idSchema = v.union([
  v.pipe(
    v.union([v.pipe(v.string(), v.transform(Number), v.number()), v.number()]),
    v.integer(),
    v.minValue(1),
  ),
  v.pipe(v.string(), v.nonEmpty()),
]);

export type GeneratedId<T extends string | number = number> = {
  id: Generated<T>;
};

export type GeneratedTime<
  T extends "created_at" | "updated_at" = "created_at",
> = T extends "created_at"
  ? {
      created_at: Generated<string>;
    }
  : {
      updated_at: Generated<string>;
    };
