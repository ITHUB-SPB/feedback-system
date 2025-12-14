import { requireModeratorProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const onePerson = requireModeratorProcedure.person.one.handler(
  async ({ context, input, errors }) => {
    try {
      const person = await _baseSelect(context.db)
        .where("person.id", "=", +input.id)
        .executeTakeFirstOrThrow();

      return person;
    } catch (error) {
      console.error(error);
      throw errors.NOT_FOUND({
        message: `Персона с ID ${input.id} не найдена`,
      });
    }
  },
);

export default onePerson;
