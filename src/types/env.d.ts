export enum EnvKeys {
  NODE_ENV = "NODE_ENV",
  APP_PORT = "APP_PORT",
  APP_JWT_SECRET = "APP_JWT_SECRET",
}

export type EnvKey = `${EnvKeys}`;

export type EnvKeysObj = Record<EnvKey, string | number | undefined>;

export enum NodeEnvs {
  DEVELOPMENT = "development",
  STAGING = "staging",
  PRODUCTION = "production",
}

export type NodeEnv = `${NodeEnvs}`;
