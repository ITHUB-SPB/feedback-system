import { requireModeratorProcedure } from "@shared/api";

const createOfficial = requireModeratorProcedure.official.create.handler(
  async ({ context, input, errors }) => {
    try {
      const { email, ...rest } = input;
      const { user: newUser } = await context.auth.api.createUser({
        body: {
          email,
          password: crypto.randomUUID().slice(0, 8),
          name: email,
          role: "official",
          data: rest,
        },
      });

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
