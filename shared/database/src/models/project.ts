import * as v from "valibot";
import { idSchema, type GeneratedId, type GeneratedTime } from "./_base";

export const projectSchema = v.object({
  id: idSchema,
  title: v.pipe(v.string(), v.nonEmpty()),
  latitude: v.pipe(v.number(), v.minValue(-90), v.maxValue(90)),
  longitude: v.pipe(v.number(), v.minValue(-180), v.maxValue(180)),
  year_of_completion: v.pipe(
    v.number(),
    v.integer(),
    v.minValue(2010),
    v.maxValue(2026),
  ),
  administrative_unit_id: idSchema,
  created_at: v.optional(
    v.union([
      v.date(),
      v.string(),
      v.pipe(v.string(), v.isoTimestamp()),
      v.pipe(v.string(), v.isoDateTime()),
    ]),
  ),
});

export type ProjectTable = v.InferOutput<typeof projectSchema> &
  GeneratedId &
  GeneratedTime;
