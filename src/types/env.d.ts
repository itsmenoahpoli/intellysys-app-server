export enum EnvKeys {
  NODE_ENV = "NODE_ENV",
  APP_PORT = "APP_PORT",
  APP_JWT_SECRET = "APP_JWT_SECRET",
  APP_NAME = "APP_NAME",
  DASHBOARD_URL = "DASHBOARD_URL",
  EMAIL_ENABLED = "EMAIL_ENABLED",
  EMAIL_INCLUDE_PASSWORD = "EMAIL_INCLUDE_PASSWORD",
  EMAIL_SUPPORT = "EMAIL_SUPPORT",
  SMTP_HOST = "SMTP_HOST",
  SMTP_PORT = "SMTP_PORT",
  SMTP_SECURE = "SMTP_SECURE",
  SMTP_USER = "SMTP_USER",
  SMTP_PASS = "SMTP_PASS",
  SMTP_FROM = "SMTP_FROM",
}

export type EnvKey = `${EnvKeys}`;

export type EnvKeysObj = Record<EnvKey, string | number | undefined>;

export enum NodeEnvs {
  DEVELOPMENT = "development",
  STAGING = "staging",
  PRODUCTION = "production",
}

export type NodeEnv = `${NodeEnvs}`;
