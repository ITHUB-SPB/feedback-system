import { requireModeratorProcedure } from "@shared/api";
import { officialEmailQueue, innerEmailQueue } from "@shared/mq";

const createOfficial = requireModeratorProcedure.official.create.handler(
  async ({ context, input, errors }) => {
    try {
      const { email, administrative_unit_id, ...rest } = input;
      const password = crypto.randomUUID().slice(0, 8);

      const { user: newUser } = await context.auth.api.createUser({
        body: {
          email,
          password,
          name: email,
          role: "official",
          data: rest,
        },
      });

      await context.db
        .insertInto("official_responsibility")
        .values({
          official_id: newUser.id,
          administrative_unit_id: administrative_unit_id,
        })
        .execute();

      const emailConfig = {
        officialName: rest.middleName
          ? `${rest.firstName} ${rest.middleName}`
          : rest.firstName,
        password,
      };

      officialEmailQueue.add("official-welcome-email", {
        ...emailConfig,
        to: email,
      });

      innerEmailQueue.add("inner-welcome-email", { ...emailConfig, email });

      return newUser;
    } catch (error) {
      console.error(error);
      throw errors.CONFLICT({
        message: "Ошибка при создании ответственного лица",
      });
    }
  },
);

export default createOfficial;
