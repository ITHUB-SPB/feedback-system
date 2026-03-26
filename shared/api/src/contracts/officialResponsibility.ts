import { oc } from "@orpc/contract";
import * as v from "valibot";

import { officialResponsibilitySchema } from "@shared/database/models/official_responsibility";
import { baseInputAll } from "./_inputs";

export const getOfficialResponsibilitySchema = v.object({
  ...officialResponsibilitySchema.entries,
  administrative_unit: v.string(),
  officialFirstName: v.string(),
  officialLastName: v.string(),
  officialMiddleName: v.optional(v.nullable(v.string())),
});

const officialResponsibilityContract = oc
  .tag("Ответственные")
  .prefix("/official_responsibilities")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "Список ответственных",
      })
      .input(baseInputAll)
      .output(v.array(getOfficialResponsibilitySchema)),
  });

export default officialResponsibilityContract;
