import * as v from "valibot";
import { idSchema, type GeneratedId } from "./_base";

export const officialResponsibilitySchema = v.object({
  id: idSchema,
  administrative_unit_id: idSchema,
  official_id: v.string(),
});

export type OfficialResponsibilityTable = v.InferOutput<
  typeof officialResponsibilitySchema
> &
  GeneratedId;
