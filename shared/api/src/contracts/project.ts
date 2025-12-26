import { oc } from "@orpc/contract";
import * as v from "valibot";

import { projectSchema } from "@shared/database/models/project";
import { baseInputAll, baseInputOne } from "./_inputs";

export const getProjectSchema = v.object({
  ...projectSchema.entries,
  administrative_unit: v.string(),
  administrative_unit_type: v.string(),
});

const projectContract = oc
  .tag("Проекты")
  .prefix("/projects")
  .router({
    one: oc
      .route({
        method: "GET",
        path: "/{id}",
        summary: "Полная информация о проекте",
      })
      .input(baseInputOne)
      .output(getProjectSchema),

    update: oc
      .route({
        method: "PATCH",
        path: "/{id}",
        summary: "Обновление проекта",
        inputStructure: "detailed",
      })
      .input(
        v.object({
          body: v.partial(v.omit(projectSchema, ["id", "created_at"])),
          params: v.object({ id: v.string() }),
        }),
      )
      .output(getProjectSchema),

    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "Список всех проектов",
        description: "Краткая информация по всем проектам",
        spec: (spec) => ({
          ...spec,
          parameters: [
            ...(spec.parameters || []),
            {
              name: "sort",
              in: "query",
              examples: {
                "one sorting": {
                  description: "One sorting rule",
                  value: "year_of_completion.desc",
                },
                "multiple sortings": {
                  description: "Multiple sorting rules",
                  value: "year_of_completion.desc&title.asc",
                },
              },
            },
            {
              name: "filter",
              in: "query",
              examples: {
                "one filter": {
                  description: "One filter rule",
                  value: "year_of_completion[eq]2023",
                },
                "multiple filters": {
                  description: "One filter rule",
                  value:
                    "year_of_completion[eq]2023&administrative_unit_type[ne]town",
                },
              },
            },
          ],
        }),
      })
      .input(baseInputAll)
      .output(v.array(getProjectSchema)),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Добавление проекта",
      })
      .input(v.omit(projectSchema, ["id", "created_at"]))
      .output(getProjectSchema),

    delete: oc
      .route({
        method: "DELETE",
        path: "/{id}",
        summary: "Удаление проекта",
      })
      .input(baseInputOne),
  });

export default projectContract;
