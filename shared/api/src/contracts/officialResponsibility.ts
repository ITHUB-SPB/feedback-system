import { oc } from "@orpc/contract";
import * as v from "valibot";

import { officialResponsibilitySchema } from "@shared/database/models/official_responsibility";
import { baseInputAll, baseInputOne } from "./_inputs";

export const getOfficialResponsibilitySchema = v.object({
  ...officialResponsibilitySchema.entries,
  administrative_unit: v.string(),
  officialFirstName: v.string(),
  officialLastName: v.string(),
  officialMiddleName: v.optional(v.nullable(v.string())),
});

export const getManyOfficialResponsibilitySchema = v.array(
  getOfficialResponsibilitySchema,
);

export const createOfficialResponsibilitySchema = v.omit(
  officialResponsibilitySchema,
  ["id"],
);

export const updateOfficialResponsibilitySchema = v.object({
  params: baseInputOne,
  body: v.partial(v.omit(officialResponsibilitySchema, ["id"])),
});

export const deleteOfficialResponsibilitySchema = v.object({
  params: baseInputOne,
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
      .output(getManyOfficialResponsibilitySchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Назначение ответственного на территорию",
      })
      .input(createOfficialResponsibilitySchema)
      .output(getOfficialResponsibilitySchema),

    update: oc
      .route({
        method: "PATCH",
        path: "/{id}",
        inputStructure: "detailed",
        summary: "Обновление ответственного за территорию",
        description:
          "Назначение нового ответственного за территорию либо изменение территории у того же ответственного",
      })
      .input(updateOfficialResponsibilitySchema)
      .output(getOfficialResponsibilitySchema),

    delete: oc
      .route({
        method: "DELETE",
        path: "/{id}",
        inputStructure: "detailed",
        summary: "Удаление проекта",
      })
      .input(deleteOfficialResponsibilitySchema),
  });

export default officialResponsibilityContract;
