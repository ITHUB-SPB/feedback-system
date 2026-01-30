import { requireModeratorProcedure } from "@shared/api";
import {
  officialEmailQueue,
} from "@shared/mq";

const createOfficial = requireModeratorProcedure.official.create.handler(
  async ({ context, input, errors }) => {
    try {
      const { email, ...rest } = input;
      const password = crypto.randomUUID().slice(0, 8)
      
      const { user: newUser } = await context.auth.api.createUser({
        body: {
          email,
          password,
          name: email,
          role: "official",
          data: rest,
        },
      });

      officialEmailQueue.add("official-welcome-email", { 
        to: email,
        officialName: rest.middleName ? `${rest.firstName} ${rest.middleName}` : rest.firstName,
        password
      })

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
