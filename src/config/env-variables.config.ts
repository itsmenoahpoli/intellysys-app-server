import { logger } from "@/utils";
import type { EnvKey, EnvKeysObj } from "@/types/env";

const envKeys: EnvKeysObj = {
  NODE_ENV: process.env.NODE_ENV ?? "production",
  APP_PORT: Number(process.env.APP_PORT ?? process.env.PORT ?? 5060),
  APP_JWT_SECRET: process.env.APP_JWT_SECRET,
} as const;

const getEnvValue = <T>(key: EnvKey) => {
  return envKeys[key] as T;
};

const validateRequiredEnv = () => {
  const requiredEnvs: string[] = ["APP_JWT_SECRET"];

  requiredEnvs.forEach((key) => {
    if (!process.env[key]) {
      logger.error(`[ENV Config] Required variable missing: ${key}`);
      process.exit(1);
    }
  });

  logger.info(
    `[ENV Config] Environment variables validated and loaded successfully`,
  );
};

export { envKeys, getEnvValue, validateRequiredEnv };
