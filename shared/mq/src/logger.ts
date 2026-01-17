import { createLogger, type BaseLogger } from "@shared/logger";
import { parseEnv } from "./env";

export const logger: BaseLogger = createLogger({ env: parseEnv().ENV });
