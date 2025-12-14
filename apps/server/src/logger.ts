import { createLogger, type BaseLogger } from "@shared/logger";
import { env } from "./env";

const logger: BaseLogger = createLogger<"info">({ env: env.ENV });

export default logger;
