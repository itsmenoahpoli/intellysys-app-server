import { logger } from "@/utils";
import type { EnvKey, EnvKeysObj } from "@/types/env";

const envKeys: EnvKeysObj = {
  NODE_ENV: process.env.NODE_ENV ?? "production",
  APP_PORT: Number(process.env.APP_PORT ?? process.env.PORT ?? 5060),
  APP_JWT_SECRET: process.env.APP_JWT_SECRET,
  APP_NAME: process.env.APP_NAME ?? "Intellysys",
  DASHBOARD_URL: process.env.DASHBOARD_URL,

  EMAIL_ENABLED: process.env.EMAIL_ENABLED ?? "false",
  EMAIL_INCLUDE_PASSWORD: process.env.EMAIL_INCLUDE_PASSWORD ?? "false",
  EMAIL_SUPPORT: process.env.EMAIL_SUPPORT,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT ?? 587),
  SMTP_SECURE: process.env.SMTP_SECURE ?? "false",
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,
} as const;

const getEnvValue = <T>(key: EnvKey) => {
  return envKeys[key] as T;
};

const parseBool = (value: unknown, defaultValue = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return defaultValue;
  const v = value.trim().toLowerCase();
  if (["1", "true", "yes", "y", "on"].includes(v)) return true;
  if (["0", "false", "no", "n", "off"].includes(v)) return false;
  return defaultValue;
};

const validateRequiredEnv = () => {
  const requiredEnvs: string[] = ["APP_JWT_SECRET"];

  requiredEnvs.forEach((key) => {
    if (!process.env[key]) {
      logger.error(`[ENV Config] Required variable missing: ${key}`);
      process.exit(1);
    }
  });

  const emailEnabled = parseBool(process.env.EMAIL_ENABLED, false);
  if (emailEnabled) {
    const requiredEmailEnvs: string[] = ["SMTP_HOST", "SMTP_FROM"];
    requiredEmailEnvs.forEach((key) => {
      if (!process.env[key]) {
        logger.error(
          `[ENV Config] EMAIL_ENABLED=true but required variable missing: ${key}`,
        );
        process.exit(1);
      }
    });
  }

  logger.info(
    `[ENV Config] Environment variables validated and loaded successfully`,
  );
};

export { envKeys, getEnvValue, validateRequiredEnv };
