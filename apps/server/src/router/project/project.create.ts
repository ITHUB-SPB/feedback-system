import { requireModeratorProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const createProject = requireModeratorProcedure.project.create.handler(
  async ({ context, input, errors }) => {
    try {
      const { id: projectId } = await context.db
        .insertInto("project")
        .values(input)
        .returning("id")
        .executeTakeFirstOrThrow();

      return await _baseSelect(context.db)
        .where("project.id", "=", Number(projectId))
        .executeTakeFirstOrThrow();
    } catch (error) {
      console.error(error);
      throw errors.CONFLICT({
        message: "Ошибка при создании нового проекта",
      });
    }
  },
);

export default createProject;
