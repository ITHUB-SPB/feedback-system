import { oc } from "@orpc/contract";
import * as v from "valibot";

import { baseInputOne, structuredInputAll } from "./_inputs";

const getOfficialSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  name: v.pipe(v.string(), v.nonEmpty()),
  email: v.pipe(v.string(), v.nonEmpty()),
  emailVerified: v.boolean(),
  image: v.optional(v.nullable(v.string())),
  firstName: v.pipe(v.string(), v.nonEmpty()),
  lastName: v.pipe(v.string(), v.nonEmpty()),
  middleName: v.pipe(v.string(), v.nonEmpty()),
  phone: v.optional(v.nullable(v.string())),
  social: v.optional(v.nullable(v.string())),
  createdAt: v.union([
    v.date(),
    v.pipe(
      v.string(),
      v.transform((value) => new Date(value)),
      v.date(),
    ),
  ]),
  updatedAt: v.union([
    v.date(),
    v.pipe(
      v.string(),
      v.transform((value) => new Date(value)),
      v.date(),
    ),
  ]),
});

const createOfficialSchema = v.object({
  email: v.pipe(v.string(), v.nonEmpty()),
  firstName: v.pipe(v.string(), v.nonEmpty()),
  lastName: v.pipe(v.string(), v.nonEmpty()),
  middleName: v.pipe(v.string(), v.nonEmpty()),
  phone: v.optional(v.nullable(v.string())),
});

const updateOfficialSchema = v.object({
  params: baseInputOne,
  body: v.partial(createOfficialSchema),
});

const getManyOfficialSchema = v.object({
  data: v.array(getOfficialSchema),
  total: v.number(),
});

const officialContract = oc
  .tag("Официальные лица")
  .prefix("/officials")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "Список всех оф. лиц",
      })
      .input(structuredInputAll)
      .output(getManyOfficialSchema),

    one: oc
      .route({
        method: "GET",
        path: "/{id}",
        summary: "Информация по оф. лицу",
      })
      .input(baseInputOne)
      .output(getOfficialSchema),

    update: oc
      .route({
        method: "PATCH",
        path: "/{id}",
        inputStructure: "detailed",
        summary: "Обновление аккаунта оф. лица",
      })
      .input(updateOfficialSchema)
      .output(getOfficialSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Создание нового оф. лица",
      })
      .input(createOfficialSchema)
      .output(getOfficialSchema),

    delete: oc
      .route({
        method: "DELETE",
        path: "/{id}",
        summary: "Удаление оф. лица",
      })
      .input(baseInputOne),
  });

export default officialContract;
